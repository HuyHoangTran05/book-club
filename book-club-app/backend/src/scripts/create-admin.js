import dotenv from "dotenv";
import bcrypt from "bcrypt";

dotenv.config();

const { default: sequelize } = await import("../config/database.js");
const { Member } = await import("../models/index.js");

const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@gmail.com").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Hungdzvcl2005";
const ADMIN_NAME = process.env.ADMIN_NAME || "Quản trị viên";

const run = async () => {
  await sequelize.authenticate();

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const existing = await Member.unscoped().findOne({ where: { email: ADMIN_EMAIL } });

  if (existing) {
    await existing.update({
      password_hash: passwordHash,
      role: "admin",
      account_status: "active",
      email_verified: true,
      full_name: existing.full_name || ADMIN_NAME,
    });
    console.log(`Promoted/updated existing account to admin: ${ADMIN_EMAIL}`);
    return;
  }

  const admin = await Member.create({
    full_name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password_hash: passwordHash,
    point_balance: 0,
    role: "admin",
    is_deliverer: false,
    account_status: "active",
    email_verified: true,
  });

  console.log(`Created admin account: ${ADMIN_EMAIL} (id=${admin.member_id})`);
};

run()
  .catch((error) => {
    console.error("Create admin failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
