import supertest from "supertest";
import app from "../../src/apps/app.js";
import { userTestUtil } from "./user-test.util.js";

// npx jest tests/user/get-current-user.test.js

describe("GET /api/users/current", () => {
  let userEmail;
  let userPassword;

  beforeAll(async () => {
    const user = await userTestUtil.createUser();
    userEmail = user.email;
    userPassword = user.password;
  });

  afterAll(async () => {
    await userTestUtil.removeUser();
  });

  it("get current user should be successful", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .get(`/api/users/current`)
      .set("Cookie", cookies);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("get current user should fail without accessToken cookie", async () => {
    const result = await supertest(app).get("/api/users/current");

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
