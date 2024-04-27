import supertest from "supertest";
import app from "../../src/apps/app/app.js";
import { userTestUtil } from "../user/user-test.util.js";

// npx jest tests/auth/login-google.test.js

describe("POST /api/users/login-google", () => {
  const userEmail = "userTest123@gmail.com";
  const userFullName = "User Test123";
  const photoProfile = null;

  afterEach(async () => {
    await userTestUtil.removeUser();
  });

  it("login user with google should be successful", async () => {
    const result = await supertest(app).post("/api/users/login-google").send({
      email: userEmail,
      fullName: userFullName,
      photoProfile: photoProfile,
    });

    expect(result.status).toBe(200);
    expect(result.body.error).toBeUndefined();
    expect(result.get("Set-Cookie")).toBeDefined();
  });

  it("login user with google should fail if input is invalid", async () => {
    const result = await supertest(app).post("/api/users/login-google").send({
      email: userEmail,
      fullName: 123456,
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
