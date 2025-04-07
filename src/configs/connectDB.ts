import { MongoService } from "../services/mongo.service";
import { MssqlService } from "../services/mssql.service";
import { RedisService } from "../services/redis.service";

const connectDB = async () => {
  await Promise.all([
    await MssqlService.initialize(),
    await RedisService.initialize(),
    await MongoService.initialize(),
  ]);
};

export { connectDB };
