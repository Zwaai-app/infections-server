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

it("accepts a list of infected randoms", async () => {
  await request(app)
    .post("/infected-randoms/submit")
    .set("Content-Type", "application/json")
    .send([])
    .expect(200);
});

it("rejects body that is not json", async () => {
  await request(app)
    .post("/infected-randoms/submit")
    .set("Content-Type", "text/plain")
    .send("")
    .expect(415);
});
