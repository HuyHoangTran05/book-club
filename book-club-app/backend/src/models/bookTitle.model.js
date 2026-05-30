import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const BookTitle = sequelize.define(
  "BookTitle",
  {
    book_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    category: DataTypes.STRING(120),
    publisher: DataTypes.STRING(160),
    edition: DataTypes.STRING(80),
    publication_year: DataTypes.INTEGER,
    isbn: {
      type: DataTypes.STRING(20),
      unique: true,
    },
    language: {
      type: DataTypes.STRING(60),
      allowNull: false,
      defaultValue: "Vietnamese",
    },
    description: DataTypes.TEXT,
    cover_url: DataTypes.TEXT,
  },
  {
    tableName: "book_titles",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  },
);

export default BookTitle;
