import { Router } from "express";

export interface Route {
  resourceName: string;
  route: Router;
}
