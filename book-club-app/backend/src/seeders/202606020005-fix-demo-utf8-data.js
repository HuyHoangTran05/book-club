// This file must be saved as UTF-8.
import largeDemoData from "./202606020004-large-demo-data.js";

export default {
  name: "202606020005-fix-demo-utf8-data",

  async up(queryInterface, Sequelize, transaction) {
    await largeDemoData.up(queryInterface, Sequelize, transaction);
  },

  async down() {
    // No-op: this seeder corrects text encoding in existing demo rows.
  },
};
