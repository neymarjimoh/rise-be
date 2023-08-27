import { Application } from "express";
import { ENVS } from "../config";
import { Route } from "../types";
import userRoute from "./users";
import postRoute from "./posts";

const routes: Route[] = [
  {
    resourceName: "users",
    route: userRoute,
  },
  {
    resourceName: "posts",
    route: postRoute,
  },
];

const appVersion = ENVS.server.version;

export default (app: Application) => {
  routes.forEach((element) => {
    app.use(`/${appVersion}/${element.resourceName}`, element.route);
  });

  app.get("/", (req, res) => {
    res.status(200).json({
      message: "Risevest Blog Test",
    });
  });

  return app;
};
