// This file must be saved as UTF-8.
import titleRelevantCoverUrls from "./202606020007-title-relevant-cover-urls.js";

export default {
  name: "202606020008-real-book-cover-urls",

  async up(queryInterface, Sequelize, transaction) {
    await titleRelevantCoverUrls.up(queryInterface, Sequelize, transaction);
  },

  async down() {
    // No-op: this seeder refreshes deterministic seeded book cover URLs.
  },
};
