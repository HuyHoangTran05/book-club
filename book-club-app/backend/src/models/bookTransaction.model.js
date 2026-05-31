import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BookTransaction = sequelize.define(
  "BookTransaction",
  {
    transaction_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    copy_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    giver_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiver_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    deliverer_id: DataTypes.UUID,
    transaction_type: {
      type: DataTypes.STRING(20),
      allowNull: false,
      validate: {
        isIn: [["permanent", "lending"]],
      },
    },
    status: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "completed", "cancelled"]],
      },
    },
    giver_confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    receiver_confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    delivery_confirmed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    expected_return_date: DataTypes.DATEONLY,
    completed_at: DataTypes.DATE,
  },
  {
    tableName: "book_transactions",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default BookTransaction;
