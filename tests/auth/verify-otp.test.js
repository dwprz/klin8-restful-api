import supertest from "supertest";
import app from "../../src/apps/app.js";
import { authTestUtil } from "./auth-test.util.js";

// npx jest tests/auth/verify-otp.test.js

describe("POST /api/users/otp/verify", () => {
  const email = "userTest123@gmail.com";
  const otp = "123456";

  beforeEach(async () => {
    await authTestUtil.createOtp(email, otp);
  });

  afterAll(async () => {
    await authTestUtil.removeOtp(email);
  });

  it("verify otp should be successful", async () => {
    const result = await supertest(app).post("/api/users/otp/verify").send({
      email: email,
      otp: otp,
    });

    expect(result.status).toBe(200);
    expect(result.body.error).toBeUndefined();
  });

  it("verify otp should fail if otp is incorrect", async () => {
    const result = await supertest(app).post("/api/users/otp/verify").send({
      email: email,
      otp: "inccorect otp",
    });

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
