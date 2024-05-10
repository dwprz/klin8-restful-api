import supertest from "supertest";
import app from "../../src/apps/app.js";
import { userTestUtil } from "../user/user-test.util.js";

// npx jest tests/auth/logout.test.js

describe("PATCH /api/users/logout", () => {
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

  it("logout user should be successful", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .patch("/api/users/logout")
      .set("Cookie", cookies);

    expect(result.status).toBe(200);
    expect(result.body.error).toBeUndefined();
  });

  it("logout user should fail without accessToken cookie", async () => {
    const result = await supertest(app).patch("/api/users/logout");

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
