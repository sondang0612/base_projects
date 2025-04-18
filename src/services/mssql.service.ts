import path from "path";
import { DataSource } from "typeorm";
import { initMockData } from "../database/data/initMockData";
import dataSource from "../database/data-source";

class MssqlService {
  private static dataSource: DataSource;

  public static async initialize(): Promise<DataSource> {
    try {
      if (this.dataSource && this.dataSource.isInitialized) {
        return this.dataSource;
      }

      this.dataSource = dataSource;

      await this.dataSource.initialize();
      await initMockData();
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

  public static async executeProcedure<T extends Object>(
    procedureName: string,
    parameters: T,
    outputParameters: { name: string; type: string; asName?: string }[] = []
  ) {
    const dataSource = this.getDataSource();

    const paramKeys = Object.keys(parameters);
    const paramPlaceholders = paramKeys.map((_, idx) => `@${idx}`).join(", ");
    const paramValues = Object.values(parameters);

    const outputDeclarations = outputParameters
      .map((param) => `DECLARE @${param.name} ${param.type};`)
      .join("\n      ");

    const outputPlaceholders = outputParameters
      .map((param) => `@${param.name} OUTPUT`)
      .join(", ");

    const outputSelects = outputParameters
      .map((param) => `@${param.name} AS ${param.asName || param.name}`)
      .join(", ");

    const sql = `
        ${outputDeclarations}
        EXEC ${procedureName} ${paramPlaceholders}${
      outputParameters.length > 0 ? ", " + outputPlaceholders : ""
    };
        SELECT ${outputSelects.length > 0 ? outputSelects : "1 as result"};
    `;

    const result = await dataSource.query(sql, paramValues);

    if (result?.length > 0) {
      return result[0];
    }

    return {};
  }
}

export { MssqlService };
