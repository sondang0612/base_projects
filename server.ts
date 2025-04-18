import dotenv from "dotenv";
dotenv.config();
import app from "./app";
import { connectDB } from "./src/database/connectDB";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("UNCAUGHT EXCEPTION! Shutting down...");
  process.exit(1);
});

const PORT = process.env.PORT || 3000;

connectDB();

const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}...`);
});

process.on("unhandledRejection", (err: any) => {
  console.warn(err.name, err.message);
  console.log("UNHANDLED REJECTION! Shutting down...");

  server?.close(() => {
    process.exit(1);
  });
});
