import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BookCopy = sequelize.define(
  "BookCopy",
  {
    copy_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    book_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    owner_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    condition: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "good",
      validate: {
        isIn: [["new", "good", "fair", "worn"]],
      },
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "available",
      validate: {
        isIn: [["available", "reserved", "borrowed", "exchanged", "unavailable"]],
      },
    },
    exchange_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "both",
      validate: {
        isIn: [["permanent", "lending", "both"]],
      },
    },
    note: DataTypes.TEXT,
  },
  {
    tableName: "book_copies",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default BookCopy;
