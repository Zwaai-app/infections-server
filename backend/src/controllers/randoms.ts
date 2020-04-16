import { Request, Response } from "express";
export const getInfectedRandoms = (request: Request, response: Response)  => {
  response.json({ randoms: [] });
};

export const addInfectedRandoms = (request: Request, response: Response) => {
  if (!request.is("application/json")) {
    response.send(415);
    return;
  } 
  response.send();
};
