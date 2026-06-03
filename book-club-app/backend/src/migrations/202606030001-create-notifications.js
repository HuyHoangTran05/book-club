import { DataTypes, Sequelize } from "sequelize";

const hasTable = async (queryInterface, tableName, transaction) => {
  const tables = await queryInterface.showAllTables({ transaction });

  return tables.some((table) => {
    if (typeof table === "string") {
      return table === tableName;
    }

    return table.tableName === tableName || table.table_name === tableName;
  });
};

const addIndexIfMissing = async (queryInterface, tableName, fields, name, transaction, options = {}) => {
  const indexes = await queryInterface.showIndex(tableName, { transaction });
  const exists = indexes.some((index) => index.name === name);

  if (exists) {
    return;
  }

  await queryInterface.addIndex(tableName, fields, {
    name,
    transaction,
    ...options,
  });
};

const removeIndexIfExists = async (queryInterface, tableName, name, transaction) => {
  const indexes = await queryInterface.showIndex(tableName, { transaction });
  const exists = indexes.some((index) => index.name === name);

  if (!exists) {
    return;
  }

  await queryInterface.removeIndex(tableName, name, { transaction });
};

const timestampColumns = {
  created_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
  updated_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
  },
};

export default {
  name: "202606030001-create-notifications",

  async up(queryInterface, _Sequelize, transaction) {
    if (!(await hasTable(queryInterface, "notifications", transaction))) {
      await queryInterface.createTable("notifications", {
        notification_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        member_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "members",
            key: "member_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        type: {
          type: DataTypes.STRING(30),
          allowNull: false,
          defaultValue: "system",
        },
        reference_id: {
          type: DataTypes.UUID,
          allowNull: true,
        },
        content: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        is_read: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        ...timestampColumns,
      }, { transaction });
    }

    await queryInterface.sequelize.query(`
      ALTER TABLE notifications
        ADD CONSTRAINT notifications_type_check
          CHECK (type IN ('transaction', 'message', 'rating', 'point', 'system')),
        ADD CONSTRAINT notifications_content_not_empty_check
          CHECK (length(trim(content)) > 0);
    `, { transaction }).catch((error) => {
      if (!/already exists/i.test(error.message)) {
        throw error;
      }
    });

    // Most common access pattern: a member's notifications, newest first.
    await addIndexIfMissing(
      queryInterface,
      "notifications",
      ["member_id", "created_at"],
      "notifications_member_created_at_idx",
      transaction,
    );
    // Fast unread-count lookups for the bell badge.
    await addIndexIfMissing(
      queryInterface,
      "notifications",
      ["member_id", "is_read"],
      "notifications_member_is_read_idx",
      transaction,
    );
  },

  async down(queryInterface, _Sequelize, transaction) {
    if (await hasTable(queryInterface, "notifications", transaction)) {
      await removeIndexIfExists(queryInterface, "notifications", "notifications_member_is_read_idx", transaction);
      await removeIndexIfExists(queryInterface, "notifications", "notifications_member_created_at_idx", transaction);
      await queryInterface.dropTable("notifications", { transaction });
    }
  },
};
