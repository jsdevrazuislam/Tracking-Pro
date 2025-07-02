import express, {
  Application,
  urlencoded,
  json,
  Request,
  Response,
  NextFunction,
} from "express";
import morgan from "morgan";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";
import rateLimit from "express-rate-limit";
import ApiError from "@/utils/api-error";
import { DATA_LIMIT } from "@/constants";
import cookieParser from "cookie-parser";
import { initializeSocketIO } from "@/socket";
import { load_routes } from "@/utils/load-routes";

const origin = ["http://192.168.1.104:3000", "http://192.168.8.76:3000", "http://localhost:3000", "https://52d9-103-7-5-26.ngrok-free.app", 'https://tracking-pro.vercel.app']
const app: Application = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  pingTimeout: 60000,
  cors: {
    origin,
    credentials: true,
  },
});

app.set("io", io);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_, __, ___, options) => {
    throw new ApiError(
      options.statusCode || 500,
      `There are too many requests. You are only allowed ${options.max
      } requests per ${options.windowMs / 60000} minutes`
    );
  },
});

app.use(
  json({
    limit: DATA_LIMIT,
  })
);
app.use(
  urlencoded({
    extended: true,
    limit: DATA_LIMIT,
  })
);

app.use(limiter);
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin,
    credentials: true,
  })
);

const startApp = async () => {

  await load_routes(app);

  initializeSocketIO({ io });

  app.get("/", (_, res: Response) => {
    res.status(404).json({
      message: "App is working.....",
    });
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log("App error", err);

    if (err instanceof ApiError) {
      res.status(err.statusCode).json(err.toJSON());
    } else {
      res.status(500).json({
        statusCode: 500,
        message: "Internal Server Error",
        success: false,
        errors: [],
        stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
      });
    }
  });
};

startApp();



export default httpServer