import os from "os";
import http from "http";
import cluster from "cluster";
import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { ENVS, redisClient } from "./config";
import { errorResponse } from "./helpers/response";
import appRoutes from "./routes";

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(`Master ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  const app: Application = express();
  const appPort = ENVS.server.port;
  const server = http.createServer(app); // Create the server

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(cors());

  appRoutes(app);

  app.all("*", (req, res) => {
    return errorResponse(res, "route not found", 404);
  });

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    return errorResponse(res, err.message ?? "Internal server error", 500);
  });

  const sigs: NodeJS.Signals[] = ["SIGINT", "SIGTERM", "SIGQUIT"];
  sigs.forEach((sig) => {
    process.on(sig, () => {
      shutdown(sig);
    });
  });

  const shutdown = async (signal: NodeJS.Signals) => {
    console.log(
      `Worker ${cluster.worker.process.pid} received ${signal}. Shutting down gracefully...`
    );

    try {
      // Close Redis connection
      console.log("Closing Redis connection...");
      await redisClient.quit();

      // Close the server
      console.log("Closing the server...");
      await new Promise<void>((resolve) => {
        server.close(() => {
          console.log(
            `Worker ${cluster.worker.process.pid} has shut down. Goodbye!`
          );
          resolve();
        });
      });
    } catch (error) {
      console.error("Error during shutdown:", error);
    } finally {
      process.exit(0);
    }
  };

  server.listen(appPort, () => {
    console.log(
      `Worker ${cluster.worker.process.pid} started on port ${appPort}!`
    );
  });
}
