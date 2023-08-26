import { Response } from "express";

export const successRes = (
  res: Response,
  data: {},
  message = "success",
  status = 200
) => {
  return res.status(status).json({
    status: true,
    data,
    message,
    error: false,
  });
};

export const errorResponse = (
  res: Response,
  message = "unsuccessful",
  status = 400,
  data = {}
) => {
  return res.status(status).json({
    status: false,
    message,
    error: true,
    data,
  });
};
