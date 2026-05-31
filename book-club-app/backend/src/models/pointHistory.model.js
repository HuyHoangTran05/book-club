import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const PointHistory = sequelize.define(
  "PointHistory",
  {
    point_history_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    transaction_id: DataTypes.UUID,
    point_change: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notZero(value) {
          if (value === 0) {
            throw new Error("point_change must not be zero");
          }
        },
      },
    },
    reason: {
      type: DataTypes.STRING(40),
      allowNull: false,
      validate: {
        isIn: [
          [
            "initial_register",
            "permanent_exchange",
            "lending",
            "delivery_bonus",
            "admin_adjustment",
          ],
        ],
      },
    },
  },
  {
    tableName: "point_histories",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
  },
);

export default PointHistory;
