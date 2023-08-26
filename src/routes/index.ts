import { Application } from "express";
import { ENVS } from "../config";
import { Route } from "../types";
import userRoute from "./users";

const routes: Route[] = [
  {
    resourceName: "users",
    route: userRoute,
  },
];

const appVersion = ENVS.server.version;

export default (app: Application) => {
  routes.forEach((element) => {
    app.use(`/${appVersion}`, element.route);
  });

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Risevest Blog Test",
    });
  });

  return app;
};
