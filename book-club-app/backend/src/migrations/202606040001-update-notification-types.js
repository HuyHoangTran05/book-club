// Widen the notifications.type CHECK constraint to include the "book" type
// (used for "added/updated/removed a book" confirmations).

export default {
  name: "202606040001-update-notification-types",

  async up(queryInterface, _Sequelize, transaction) {
    await queryInterface.sequelize.query(
      `
      ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
      ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
        CHECK (type IN ('transaction', 'message', 'rating', 'point', 'system', 'book'));
    `,
      { transaction },
    );
  },

  async down(queryInterface, _Sequelize, transaction) {
    await queryInterface.sequelize.query(
      `
      ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
      ALTER TABLE notifications ADD CONSTRAINT notifications_type_check
        CHECK (type IN ('transaction', 'message', 'rating', 'point', 'system'));
    `,
      { transaction },
    );
  },
};
