import cors from "cors";
import express, { Request } from "express";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { AppError } from "./src/utils/appError";
import userRouter from "./src/routes/user.routes";
import devaRouter from "./src/routes/deva.routes";
import { swaggerSpec } from "./src/utils/swagger";
import swaggerUI from "swagger-ui-express";
import globalErrorHandler from "./src/handlers/global-error.handler";
import helmet from "helmet";

const app = express();

// set security http headers
app.use(helmet());

app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// limit request api
// 100 request for the same ip each 1 hours
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour",
});
app.use("/api", limiter);

// body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

app.use((req: Request, _, next) => {
  req.requestTime = new Date().toISOString();
  //console.log(req.headers);
  next();
});
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// Routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/deva", devaRouter);

app.all(/(.*)/, (req, _, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

export default app;
