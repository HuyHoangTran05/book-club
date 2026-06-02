import bcrypt from "bcrypt";

const ADMIN_ID = "99999999-9999-4999-8999-999999999999";
const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Hungdzvcl2005";

export default {
  name: "202606020004-admin-account",

  async up(queryInterface, Sequelize, transaction) {
    const options = { transaction };

    const existing = await queryInterface.sequelize.query(
      "SELECT member_id FROM members WHERE email = :email LIMIT 1",
      {
        replacements: { email: ADMIN_EMAIL },
        type: Sequelize.QueryTypes.SELECT,
        transaction,
      },
    );

    if (existing.length > 0) {
      // Admin already exists (e.g. created via the create-admin script) — skip.
      return;
    }

    const now = new Date();
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await queryInterface.bulkInsert(
      "members",
      [
        {
          member_id: ADMIN_ID,
          full_name: "Quản trị viên",
          email: ADMIN_EMAIL,
          password_hash: passwordHash,
          phone: null,
          address: null,
          point_balance: 0,
          role: "admin",
          is_deliverer: false,
          account_status: "active",
          email_verified: true,
          created_at: now,
          updated_at: now,
        },
      ],
      options,
    );
  },

  async down(queryInterface, _Sequelize, transaction) {
    await queryInterface.bulkDelete("members", { email: ADMIN_EMAIL }, { transaction });
  },
};
