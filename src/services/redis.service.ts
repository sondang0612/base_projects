import { createClient, RedisClientType } from "redis";
import { EStatusConnectRedis } from "../constants/status-connect-redis.enum";
import { AppError } from "../utils/appError";
export type RedisClient = RedisClientType<any, any, any>;

class RedisService {
  private static _client: RedisClient | undefined;
  private static connectTimeout: any;

  private get client(): RedisClient | undefined {
    if (!RedisService._client) {
      RedisService._client = RedisService.getClient();
    }
    return RedisService._client;
  }

  public static async initialize(): Promise<RedisClient> {
    try {
      if (this._client) {
        return this._client;
      }

      this._client = createClient({
        url: process.env.REDIS_URL,
        socket: {
          reconnectStrategy: (retries) => {
            return Math.min(retries * 100, 10000);
          },
        },
      }) as RedisClient;

      this.handleEventConnection(this._client);

      await this._client.connect();

      console.log("[Redis] Connected successfully");
      return this._client;
    } catch (error) {
      console.error("[Redis] Connected error:", error);
      throw error;
    }
  }

  private static handleEventConnection = (connectionRedis: RedisClient) => {
    connectionRedis.on(EStatusConnectRedis.CONNECT, () => {
      console.log("connectionRedis - Connection status: connected");
      clearTimeout(this.connectTimeout);
    });

    connectionRedis.on(EStatusConnectRedis.END, () => {
      console.log("connectionRedis - Connection status: disconnected");
      this.handleTimeoutError();
    });

    connectionRedis.on(EStatusConnectRedis.RECONNECT, () => {
      console.log("connectionRedis - Connection status: reconnecting");
      clearTimeout(this.connectTimeout);
    });

    connectionRedis.on(EStatusConnectRedis.ERROR, (err: Error) => {
      console.log(`connectionRedis - Connection status: error ${err}`);
      this.handleTimeoutError();
    });
  };

  private static handleTimeoutError = () => {
    this.connectTimeout = setTimeout(() => {
      throw new AppError("Redis Error", 500);
    }, 10000);
  };

  public static getClient() {
    return this._client;
  }

  set(key: string, value: string) {
    this.client?.set(key, value, {
      EX: Number(process.env.USER_TOKEN_TTL),
    });
  }

  async get(key: string) {
    return await this.client?.get(key);
  }

  async remove(key: string) {
    return await this.client?.del(key);
  }
}

const redisService = new RedisService();

export default redisService;
export { RedisService };
