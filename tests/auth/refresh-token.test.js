import supertest from "supertest";
import app from "../../src/apps/app.js";
import { userTestUtil } from "../user/user-test.util.js";

// npx jest tests/auth/refresh-token.test.js

describe("POST /api/users/refresh-token", () => {
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

  it("refresh token should be successful", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .post("/api/users/refresh-token")
      .set("Cookie", cookies);

    expect(result.status).toBe(201);
    expect(result.body.error).toBeUndefined();
    expect(result.get("Set-Cookie")).toBeDefined();
  });

  it("refresh token should fail without refreshToken cookie", async () => {
    const result = await supertest(app).post("/api/users/refresh-token");

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
