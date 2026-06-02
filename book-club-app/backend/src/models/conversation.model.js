import { DataTypes } from "sequelize";
import sequelize from "../config/database.js";

const Conversation = sequelize.define(
  "Conversation",
  {
    conversation_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    member1_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    member2_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    tableName: "conversations",
    underscored: true,
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
    indexes: [
      {
        unique: true,
        fields: ["member1_id", "member2_id"],
      },
    ],
  },
);

export default Conversation;
