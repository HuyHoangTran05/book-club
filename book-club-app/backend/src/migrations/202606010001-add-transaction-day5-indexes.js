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
  name: "202606010001-add-transaction-day5-indexes",

  async up(queryInterface, _Sequelize, transaction) {
    await addIndexIfMissing(
      queryInterface,
      "book_transactions",
      ["copy_id"],
      "book_transactions_copy_id_idx",
      transaction,
    );
    await addIndexIfMissing(
      queryInterface,
      "book_transactions",
      ["giver_id"],
      "book_transactions_giver_id_idx",
      transaction,
    );
    await addIndexIfMissing(
      queryInterface,
      "book_transactions",
      ["receiver_id"],
      "book_transactions_receiver_id_idx",
      transaction,
    );
  },

  async down(queryInterface, _Sequelize, transaction) {
    await removeIndexIfExists(
      queryInterface,
      "book_transactions",
      "book_transactions_receiver_id_idx",
      transaction,
    );
    await removeIndexIfExists(
      queryInterface,
      "book_transactions",
      "book_transactions_giver_id_idx",
      transaction,
    );
    await removeIndexIfExists(
      queryInterface,
      "book_transactions",
      "book_transactions_copy_id_idx",
      transaction,
    );
  },
};
