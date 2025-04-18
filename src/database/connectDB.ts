import { MongoService } from "../services/mongo.service";
import { MssqlService } from "../services/mssql.service";
import { RedisService } from "../services/redis.service";

const connectDB = async () => {
  await Promise.allSettled([
    MssqlService.initialize(),
    RedisService.initialize(),
    MongoService.initialize(),
  ]);
};

export { connectDB };
