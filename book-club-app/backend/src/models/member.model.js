import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Member = sequelize.define(
  "Member",
  {
    member_id: {
      type: DataTypes.UUID,
<<<<<<< HEAD
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
=======
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    full_name: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password_hash: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    phone: DataTypes.STRING(20),
    address: DataTypes.TEXT,
    point_balance: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 20,
      validate: {
        min: 0,
      },
    },
    role: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "member",
      validate: {
        isIn: [["member", "admin"]],
      },
    },
    is_deliverer: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    account_status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "active",
      validate: {
        isIn: [["active", "locked", "inactive"]],
      },
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    last_login_at: DataTypes.DATE,
  },
  {
    tableName: "members",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    defaultScope: {
      attributes: { exclude: ["password_hash"] },
    },
    scopes: {
      withPassword: {
        attributes: {},
      },
    },
>>>>>>> origin/main
  },
);

export default Member;
