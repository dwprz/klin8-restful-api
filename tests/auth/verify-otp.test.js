import supertest from "supertest";
import app from "../../src/apps/app/app.js";
import { authTestUtil } from "./auth-test.util.js";

// npx jest tests/auth/verify-otp.test.js

describe("POST /api/users/verify-otp", () => {
  let otp;

  beforeAll(async () => {
    otp = await authTestUtil.createOtp();
  });

  afterAll(async () => {
    await authTestUtil.removeOtp();
  });

  it("verify otp should be successful", async () => {
    const result = await supertest(app).post("/api/users/verify-otp").send({
      email: "klin8shoes@gmail.com",
      otp: otp,
    });

    expect(result.status).toBe(200);
    expect(result.body.error).toBeUndefined();

    await authTestUtil.removeOtp();
  });

  it("verify otp should fail if otp is incorrect", async () => {
    const result = await supertest(app).post("/api/users/verify-otp").send({
      email: "klin8shoes@gmail.com",
      otp: "inccorect otp",
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
