import supertest from "supertest";
import app from "../../src/apps/app.js";
import { userTestUtil } from "../user/user-test.util.js";

// npx jest tests/auth/register.test.js

describe("POST /api/users/register", () => {
  const userEmail = "userTest123@gmail.com";
  const userFullName = "User Test123";
  const userPassword = "Password Test";

  afterEach(async () => {
    await userTestUtil.removeUser();
  });

  it("register user should be successful", async () => {
    const result = await supertest(app).post("/api/users/register").send({
      email: userEmail,
      fullName: userFullName,
      password: userPassword,
    });

    expect(result.status).toBe(201);
    expect(result.body.error).toBeUndefined();
  });

  it("register user should fail if input is invalid", async () => {
    const result = await supertest(app).post("/api/users/register").send({
      email: 123456,
      fullName: userFullName,
      password: userPassword,
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
