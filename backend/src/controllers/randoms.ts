import { Request, Response } from "express";
export const getInfectedRandoms = (request: Request, response: Response)  => {
  response.json({ randoms: [] });
};
