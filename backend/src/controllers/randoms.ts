import { Request, Response } from "express";
import { Random } from "../models/Random";

export const getInfectedRandoms = async (request: Request, response: Response)  => {
  const values: string[] = [];
  for (const random of await Random.find({})) {
    values.push(random.value);
  }
  response.json({ randoms: values });
};

export const addInfectedRandoms = async (request: Request, response: Response) => {
  if (!request.is("application/json")) {
    response.send(415);
    return;
  }
  
  for (const value of request.body) {
    const random = new Random();
    random.value = value;
    await random.save();          
  };

  response.sendStatus(200);
};
