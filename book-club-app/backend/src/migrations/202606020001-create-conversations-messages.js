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
  name: "202606020001-create-conversations-messages",

  async up(queryInterface, _Sequelize, transaction) {
    if (!(await hasTable(queryInterface, "conversations", transaction))) {
      await queryInterface.createTable("conversations", {
        conversation_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        member1_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "members",
            key: "member_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        member2_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "members",
            key: "member_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        ...timestampColumns,
      }, { transaction });
    }

    if (!(await hasTable(queryInterface, "messages", transaction))) {
      await queryInterface.createTable("messages", {
        message_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        conversation_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "conversations",
            key: "conversation_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        sender_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "members",
            key: "member_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
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
      ALTER TABLE conversations
        ADD CONSTRAINT conversations_distinct_members_check CHECK (member1_id <> member2_id);

      ALTER TABLE messages
        ADD CONSTRAINT messages_content_not_empty_check CHECK (length(trim(content)) > 0);
    `, { transaction }).catch((error) => {
      if (!/already exists/i.test(error.message)) {
        throw error;
      }
    });

    await addIndexIfMissing(
      queryInterface,
      "conversations",
      ["member1_id", "member2_id"],
      "conversations_member_pair_unique_idx",
      transaction,
      { unique: true },
    );
    await addIndexIfMissing(
      queryInterface,
      "conversations",
      ["updated_at"],
      "conversations_updated_at_idx",
      transaction,
    );
    await addIndexIfMissing(
      queryInterface,
      "messages",
      ["conversation_id", "created_at"],
      "messages_conversation_created_at_idx",
      transaction,
    );
    await addIndexIfMissing(
      queryInterface,
      "messages",
      ["sender_id"],
      "messages_sender_id_idx",
      transaction,
    );
  },

  async down(queryInterface, _Sequelize, transaction) {
    if (await hasTable(queryInterface, "messages", transaction)) {
      await removeIndexIfExists(queryInterface, "messages", "messages_sender_id_idx", transaction);
      await removeIndexIfExists(queryInterface, "messages", "messages_conversation_created_at_idx", transaction);
      await queryInterface.dropTable("messages", { transaction });
    }

    if (await hasTable(queryInterface, "conversations", transaction)) {
      await removeIndexIfExists(queryInterface, "conversations", "conversations_updated_at_idx", transaction);
      await removeIndexIfExists(queryInterface, "conversations", "conversations_member_pair_unique_idx", transaction);
      await queryInterface.dropTable("conversations", { transaction });
    }
  },
};
