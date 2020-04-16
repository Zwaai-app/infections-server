import request from "supertest";
import { Random } from "../src/models/Random";
import app from "../src/app";

afterEach(async () => {
  if (await Random.exists({})) {
    await Random.collection.drop();
  }
});

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

it("saves submitted randoms to list of infected randoms", async () => {
  const randoms = ["one", "two"];
  await request(app)
    .post("/infected-randoms/submit")
    .set("Content-Type", "application/json")
    .send(randoms);
  await request(app)
    .get("/infected-randoms")
    .expect("Content-Type", /json/)
    .expect(200, { randoms });  
});

it("appends submitted randoms to list of infected randoms", async () => {
  await request(app)
    .post("/infected-randoms/submit")
    .set("Content-Type", "application/json")
    .send(["one", "two"]);
   await request(app)
    .post("/infected-randoms/submit")
    .set("Content-Type", "application/json")
    .send(["three", "four"]);
  await request(app)
    .get("/infected-randoms")
    .expect("Content-Type", /json/)
    .expect(200, { randoms: ["one", "two", "three", "four"] });  
});
