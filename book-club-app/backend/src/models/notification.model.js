import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

export const NOTIFICATION_TYPES = [
  "transaction",
  "message",
  "rating",
  "point",
  "system",
  "book",
];

const Notification = sequelize.define(
  "Notification",
  {
    notification_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    member_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "system",
      validate: {
        isIn: [NOTIFICATION_TYPES],
      },
    },
    // Optional pointer to the related entity (transaction_id, conversation_id, rating_id, ...).
    reference_id: {
      type: DataTypes.UUID,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 500],
      },
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    tableName: "notifications",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default Notification;
