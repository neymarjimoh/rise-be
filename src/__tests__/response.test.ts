import { successRes, errorResponse } from "../helpers/response";
import { Response } from "express";

describe("Response Utils", () => {
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it("should create a success response", () => {
    const data = { key: "value" };
    const message = "Successful response";
    const status = 200;

    successRes(mockResponse as Response, data, message, status);

    expect(mockResponse.status).toHaveBeenCalledWith(status);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: true,
      data,
      message,
      error: false,
    });
  });

  it("should create an error response", () => {
    const message = "Unsuccessful response";
    const status = 400;
    const data = { error: "some error" };

    errorResponse(mockResponse as Response, message, status, data);

    expect(mockResponse.status).toHaveBeenCalledWith(status);
    expect(mockResponse.json).toHaveBeenCalledWith({
      status: false,
      message,
      error: true,
      data,
    });
  });
});
