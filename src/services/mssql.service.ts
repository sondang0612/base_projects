import path from "path";
import { DataSource } from "typeorm";

class MssqlService {
  private static dataSource: DataSource;

  public static async initialize(): Promise<DataSource> {
    try {
      if (this.dataSource && this.dataSource.isInitialized) {
        return this.dataSource;
      }

      this.dataSource = new DataSource({
        type: "mssql",
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        entities: [path.join(__dirname, "../entities/mssql/*.entity.{ts,js}")],
        synchronize: false,
        logging: false,
        options: {
          trustServerCertificate: true,
          connectTimeout: 30000,
          cancelTimeout: 30000,
        },
      });

      await this.dataSource.initialize();
      console.log("[MSSQL] Connected successfully");
      return this.dataSource;
    } catch (error) {
      console.error("[MSSQL] Connected error", error);
      throw error;
    }
  }

  public static getDataSource(): DataSource {
    if (!this.dataSource || !this.dataSource.isInitialized) {
      throw new Error(
        "Database connection not initialized. Call initialize() first."
      );
    }
    return this.dataSource;
  }

  public static async closeConnection(): Promise<void> {
    if (this.dataSource && this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
}

export { MssqlService };
