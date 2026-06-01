import dotenv from "dotenv";
import { DataTypes, QueryTypes, Sequelize } from "sequelize";
import createCoreTables from "../migrations/202605300001-create-core-tables.js";
import addUpdatedAtToTransactionPointHistory from "../migrations/202605310001-add-updated-at-to-transaction-point-history.js";
import addTransactionDay5Indexes from "../migrations/202606010001-add-transaction-day5-indexes.js";

dotenv.config();

const { default: sequelize } = await import("../config/database.js");

const migrations = [
  createCoreTables,
  addUpdatedAtToTransactionPointHistory,
  addTransactionDay5Indexes,
];
const metaTable = "sequelize_migrations";

const ensureMetaTable = async (queryInterface) => {
  await queryInterface.createTable(metaTable, {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    executed_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
  });
};

const hasMetaTable = async () => {
  const tables = await sequelize.getQueryInterface().showAllTables();
  return tables.some((table) => {
    if (typeof table === "string") {
      return table === metaTable;
    }

    return table.tableName === metaTable || table.table_name === metaTable;
  });
};

const getExecutedNames = async () => {
  if (!(await hasMetaTable())) {
    return new Set();
  }

  const rows = await sequelize.query(`SELECT name FROM ${metaTable}`, {
    type: QueryTypes.SELECT,
  });

  return new Set(rows.map((row) => row.name));
};

const migrate = async () => {
  const queryInterface = sequelize.getQueryInterface();

  await sequelize.authenticate();

  if (!(await hasMetaTable())) {
    await ensureMetaTable(queryInterface);
  }

  const executedNames = await getExecutedNames();

  for (const migration of migrations) {
    if (executedNames.has(migration.name)) {
      console.log(`Skipping migration ${migration.name}`);
      continue;
    }

    console.log(`Running migration ${migration.name}`);
    await sequelize.transaction(async (transaction) => {
      await migration.up(queryInterface, Sequelize, transaction);
      await queryInterface.bulkInsert(
        metaTable,
        [{ name: migration.name, executed_at: new Date() }],
        { transaction },
      );
    });
  }

  console.log("Database migrations completed");
};

migrate()
  .catch((error) => {
    console.error("Migration failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
