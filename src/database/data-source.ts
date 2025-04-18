import path from "path";
import { DataSource, DataSourceOptions } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

const dataSourceOptions: DataSourceOptions = {
  type: "mssql",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [path.join(__dirname, "/entities/mssql/*.entity.{ts,js}")],
  migrations: [path.join(__dirname, "/migrations/mssql/*.{ts,js}")],
  synchronize: false,
  logging: false,
  options: {
    trustServerCertificate: true,
    connectTimeout: 30000,
    cancelTimeout: 30000,
  },
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
