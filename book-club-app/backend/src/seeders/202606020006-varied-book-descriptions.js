// This file must be saved as UTF-8.
import largeDemoData from "./202606020004-large-demo-data.js";

export default {
  name: "202606020006-varied-book-descriptions",

  async up(queryInterface, Sequelize, transaction) {
    await largeDemoData.up(queryInterface, Sequelize, transaction);
  },

  async down() {
    // No-op: this seeder refreshes seeded descriptions and copy notes.
  },
};
