import supertest from "supertest";
import app from "../../src/apps/app/app.js";
import { userTestUtil } from "./user-test.util.js";

// npx jest tests/user/update-email.test.js

describe("PATCH /api/users/current/email", () => {
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

  it("update user email should be successful", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .patch(`/api/users/current/email`)
      .send({
        newEmail: "New " + userEmail,
        password: userPassword,
      })
      .set("Cookie", cookies);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.get("Set-Cookie")).toBeDefined();
  });

  it("update user email should fail without accessToken cookie", async () => {
    const result = await supertest(app).patch("/api/users/current/email");

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
