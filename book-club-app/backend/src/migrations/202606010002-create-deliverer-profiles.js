import { DataTypes, Sequelize } from "sequelize";

const addIndexIfMissing = async (queryInterface, tableName, fields, name, transaction) => {
  const indexes = await queryInterface.showIndex(tableName, { transaction });
  const exists = indexes.some((index) => index.name === name);

  if (exists) {
    return;
  }

  await queryInterface.addIndex(tableName, fields, {
    name,
    transaction,
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

export default {
  name: "202606010002-create-deliverer-profiles",

  async up(queryInterface, _Sequelize, transaction) {
    const tables = await queryInterface.showAllTables({ transaction });
    const hasTable = tables.some((table) => {
      if (typeof table === "string") {
        return table === "deliverer_profiles";
      }

      return table.tableName === "deliverer_profiles" || table.table_name === "deliverer_profiles";
    });

    if (!hasTable) {
      await queryInterface.createTable("deliverer_profiles", {
        profile_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        member_id: {
          type: DataTypes.UUID,
          allowNull: false,
          unique: true,
          references: {
            model: "members",
            key: "member_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        service_area: {
          type: DataTypes.STRING(255),
          allowNull: false,
        },
        available_hours: {
          type: DataTypes.STRING(120),
          allowNull: false,
        },
        total_deliveries: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        is_active: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
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
      }, { transaction });
    }

    await addIndexIfMissing(
      queryInterface,
      "deliverer_profiles",
      ["member_id"],
      "deliverer_profiles_member_id_idx",
      transaction,
    );
    await addIndexIfMissing(
      queryInterface,
      "deliverer_profiles",
      ["is_active"],
      "deliverer_profiles_is_active_idx",
      transaction,
    );
  },

  async down(queryInterface, _Sequelize, transaction) {
    const tables = await queryInterface.showAllTables({ transaction });
    const hasTable = tables.some((table) => {
      if (typeof table === "string") {
        return table === "deliverer_profiles";
      }

      return table.tableName === "deliverer_profiles" || table.table_name === "deliverer_profiles";
    });

    if (!hasTable) {
      return;
    }

    await removeIndexIfExists(
      queryInterface,
      "deliverer_profiles",
      "deliverer_profiles_is_active_idx",
      transaction,
    );
    await removeIndexIfExists(
      queryInterface,
      "deliverer_profiles",
      "deliverer_profiles_member_id_idx",
      transaction,
    );
    await queryInterface.dropTable("deliverer_profiles", { transaction });
  },
};
