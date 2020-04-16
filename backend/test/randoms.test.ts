import request from "supertest";
import app from "../src/app";

it("returns an empty list of infected randoms", async () => {
  await request(app)
          .get("/infected-randoms")
          .expect("Content-Type", /json/)
          .expect(200, {
            randoms: []
          });
});
