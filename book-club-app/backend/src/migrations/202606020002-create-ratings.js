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

const addConstraintIfMissing = async (queryInterface, tableName, constraintName, sql, transaction) => {
  const constraints = await queryInterface.showConstraint(tableName, { transaction });
  const exists = constraints.some((constraint) => constraint.constraintName === constraintName);

  if (exists) {
    return;
  }

  await queryInterface.sequelize.query(sql, { transaction });
};

export default {
  name: "202606020002-create-ratings",

  async up(queryInterface, _Sequelize, transaction) {
    if (!(await hasTable(queryInterface, "ratings", transaction))) {
      await queryInterface.createTable("ratings", {
        rating_id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        transaction_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "book_transactions",
            key: "transaction_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        rater_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "members",
            key: "member_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        rated_member_id: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "members",
            key: "member_id",
          },
          onUpdate: "CASCADE",
          onDelete: "CASCADE",
        },
        score: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        comment: {
          type: DataTypes.TEXT,
          allowNull: true,
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

    await addConstraintIfMissing(
      queryInterface,
      "ratings",
      "ratings_score_range_check",
      "ALTER TABLE ratings ADD CONSTRAINT ratings_score_range_check CHECK (score >= 1 AND score <= 5)",
      transaction,
    );
    await addConstraintIfMissing(
      queryInterface,
      "ratings",
      "ratings_distinct_members_check",
      "ALTER TABLE ratings ADD CONSTRAINT ratings_distinct_members_check CHECK (rater_id <> rated_member_id)",
      transaction,
    );

    await addIndexIfMissing(
      queryInterface,
      "ratings",
      ["transaction_id", "rater_id", "rated_member_id"],
      "ratings_transaction_rater_rated_unique_idx",
      transaction,
      { unique: true },
    );
    await addIndexIfMissing(
      queryInterface,
      "ratings",
      ["rated_member_id", "created_at"],
      "ratings_rated_member_created_at_idx",
      transaction,
    );
    await addIndexIfMissing(
      queryInterface,
      "ratings",
      ["rater_id", "created_at"],
      "ratings_rater_created_at_idx",
      transaction,
    );
  },

  async down(queryInterface, _Sequelize, transaction) {
    if (!(await hasTable(queryInterface, "ratings", transaction))) {
      return;
    }

    await removeIndexIfExists(queryInterface, "ratings", "ratings_rater_created_at_idx", transaction);
    await removeIndexIfExists(queryInterface, "ratings", "ratings_rated_member_created_at_idx", transaction);
    await removeIndexIfExists(queryInterface, "ratings", "ratings_transaction_rater_rated_unique_idx", transaction);
    await queryInterface.dropTable("ratings", { transaction });
  },
};
