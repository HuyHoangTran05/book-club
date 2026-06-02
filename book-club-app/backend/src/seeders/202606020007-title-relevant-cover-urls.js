// This file must be saved as UTF-8.
import { makeBookCover } from "./book-cover-helpers.js";

const now = () => new Date();
const uuid = (prefix, index) => `${prefix}-0000-4000-8000-${String(index).padStart(12, "0")}`;

const firstBookIds = {
  1: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  2: "cccccccc-cccc-4ccc-8ccc-cccccccccccc",
  3: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  4: "20000000-0000-4000-8000-000000000004",
  5: "dddddddd-dddd-4ddd-8ddd-dddddddddddd",
  6: "20000000-0000-4000-8000-000000000006",
  7: "20000000-0000-4000-8000-000000000007",
  8: "20000000-0000-4000-8000-000000000008",
  9: "20000000-0000-4000-8000-000000000009",
  10: "20000000-0000-4000-8000-000000000010",
  11: "20000000-0000-4000-8000-000000000011",
  12: "20000000-0000-4000-8000-000000000012",
  13: "20000000-0000-4000-8000-000000000013",
  14: "20000000-0000-4000-8000-000000000014",
  15: "20000000-0000-4000-8000-000000000015",
  16: "20000000-0000-4000-8000-000000000016",
  20: "eeeeeeee-eeee-4eee-8eee-eeeeeeeeeeee",
};

const seededBookIds = [
  ...Object.values(firstBookIds),
  ...Array.from({ length: 84 }, (_, index) => uuid("22000000", index + 17)),
];

const hasTable = async (queryInterface, tableName, transaction) => {
  const tables = await queryInterface.showAllTables({ transaction });

  return tables.some((table) => {
    if (typeof table === "string") {
      return table === tableName;
    }

    return table.tableName === tableName || table.table_name === tableName;
  });
};

export default {
  name: "202606020007-title-relevant-cover-urls",

  async up(queryInterface, Sequelize, transaction) {
    if (!(await hasTable(queryInterface, "book_titles", transaction))) {
      return;
    }

    const rows = await queryInterface.sequelize.query(`
      SELECT book_id, title, category
      FROM book_titles
      WHERE book_id IN (:book_ids);
    `, {
      replacements: { book_ids: seededBookIds },
      transaction,
      type: Sequelize.QueryTypes.SELECT,
    });

    for (const row of rows) {
      await queryInterface.sequelize.query(`
        UPDATE book_titles
        SET cover_url = :cover_url,
            updated_at = :updated_at
        WHERE book_id = :book_id;
      `, {
        replacements: {
          book_id: row.book_id,
          cover_url: makeBookCover(row.title, row.category),
          updated_at: now(),
        },
        transaction,
      });
    }

    console.log(`Updated ${rows.length} seeded book cover URLs`);
  },

  async down() {
    // No-op: this seeder fixes seeded cover URLs without changing schema or user data.
  },
};
