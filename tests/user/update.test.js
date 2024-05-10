import supertest from "supertest";
import app from "../../src/apps/app.js";
import { userTestUtil } from "./user-test.util.js";

// npx jest tests/user/update.test.js

describe("PATCH /api/users", () => {
  let userEmail;
  let userFullName;
  let userPassword;

  beforeAll(async () => {
    const user = await userTestUtil.createUser();
    userEmail = user.email;
    userFullName = user.fullName;
    userPassword = user.password;
  });

  afterAll(async () => {
    await userTestUtil.removeUser();
  });

  it("update user should be successful", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .patch(`/api/users/current`)
      .send({
        fullName: "New " + userFullName,
        password: userPassword,
      })
      .set("Cookie", cookies);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("update user should fail without accessToken cookie", async () => {
    const result = await supertest(app).patch("/api/users/current");

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
