import mongoose from "mongoose";

class MongoService {
  private static isConnected = false;

  public static async initialize(): Promise<typeof mongoose> {
    if (this.isConnected) {
      return mongoose;
    }

    try {
      const mongoUri = process.env.DB_MONGO_URI || "";
      await mongoose.connect(mongoUri);
      this.isConnected = true;
      console.log("[MongoDB] Connected successfully");

      return mongoose;
    } catch (err) {
      console.error("[MongoDB] Connection error:", err);
      process.exit(1);
    }
  }
}

export { MongoService };
