import dotenv from "dotenv";
import { DataTypes, QueryTypes, Sequelize } from "sequelize";
import coreDemoData from "../seeders/202605300001-core-demo-data.js";
import richDemoData from "../seeders/202606020003-rich-demo-data.js";
import largeDemoData from "../seeders/202606020004-large-demo-data.js";
import fixDemoUtf8Data from "../seeders/202606020005-fix-demo-utf8-data.js";
import variedBookDescriptions from "../seeders/202606020006-varied-book-descriptions.js";

dotenv.config();

const { default: sequelize } = await import("../config/database.js");

const seeders = [coreDemoData, richDemoData, largeDemoData, fixDemoUtf8Data, variedBookDescriptions];
const metaTable = "sequelize_seeders";

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

const seed = async () => {
  const queryInterface = sequelize.getQueryInterface();

  await sequelize.authenticate();

  if (!(await hasMetaTable())) {
    await ensureMetaTable(queryInterface);
  }

  const executedNames = await getExecutedNames();

  for (const seeder of seeders) {
    if (executedNames.has(seeder.name)) {
      console.log(`Skipping seeder ${seeder.name}`);
      continue;
    }

    console.log(`Running seeder ${seeder.name}`);
    await sequelize.transaction(async (transaction) => {
      await seeder.up(queryInterface, Sequelize, transaction);
      await queryInterface.bulkInsert(
        metaTable,
        [{ name: seeder.name, executed_at: new Date() }],
        { transaction },
      );
    });
  }

  console.log("Database seed completed");
};

seed()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
