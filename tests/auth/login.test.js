import supertest from "supertest";
import app from "../../src/apps/app/app.js";
import { userTestUtil } from "../user/user-test.util.js";

// npx jest tests/auth/login.test.js

describe("POST /api/users/login", () => {
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

  it("login user should be successful", async () => {
    const result = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    expect(result.status).toBe(200);
    expect(result.body.error).toBeUndefined();
    expect(result.get("Set-Cookie")).toBeDefined();
  });

  it("login user should fail if password is incorrect", async () => {
    const result = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: "Incorrect Password",
    });

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
