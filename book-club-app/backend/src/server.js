import dotenv from "dotenv";

dotenv.config();

const { default: app } = await import("./app.js");
const { default: sequelize } = await import("./config/database.js");
await import("./models/index.js");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
