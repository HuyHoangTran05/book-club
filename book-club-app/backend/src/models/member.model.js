import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Member = sequelize.define(
  "Member",
  {
    member_id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    point_balance: {
      type: DataTypes.INTEGER,
      defaultValue: 20,
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "member",
    },
    is_deliverer: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    account_status: {
      type: DataTypes.STRING,
      defaultValue: "active",
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    tableName: "MEMBER",
    timestamps: true,
    underscored: true,
  },
);

export default Member;
