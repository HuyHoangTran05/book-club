import { DataTypes, Sequelize } from "sequelize";

const addUpdatedAtIfMissing = async (queryInterface, tableName, transaction) => {
  const table = await queryInterface.describeTable(tableName, { transaction });

  if (table.updated_at) {
    return;
  }

  await queryInterface.addColumn(
    tableName,
    "updated_at",
    {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    { transaction },
  );
};

const removeUpdatedAtIfExists = async (queryInterface, tableName, transaction) => {
  const table = await queryInterface.describeTable(tableName, { transaction });

  if (!table.updated_at) {
    return;
  }

  await queryInterface.removeColumn(tableName, "updated_at", { transaction });
};

export default {
  name: "202605310001-add-updated-at-to-transaction-point-history",

  async up(queryInterface, _Sequelize, transaction) {
    await addUpdatedAtIfMissing(queryInterface, "book_transactions", transaction);
    await addUpdatedAtIfMissing(queryInterface, "point_histories", transaction);
  },

  async down(queryInterface, _Sequelize, transaction) {
    await removeUpdatedAtIfExists(queryInterface, "point_histories", transaction);
    await removeUpdatedAtIfExists(queryInterface, "book_transactions", transaction);
  },
};
