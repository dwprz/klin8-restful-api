import supertest from "supertest";
import app from "../../src/apps/app/app.js";
import { authTestUtil } from "./auth-test.util.js";

// npx jest tests/auth/send-otp.test.js

describe("POST /api/users/otp", () => {
  afterEach(async () => {
    await authTestUtil.removeOtp();
  });

  it("send otp should be successful", async () => {
    const result = await supertest(app).post("/api/users/otp").send({
      email: "klin8shoes@gmail.com",
    });

    expect(result.status).toBe(200);
    expect(result.body.error).toBeUndefined();
  }, 15000 /* 15 detik */);

  it("send otp should fail if email is incorrect", async () => {
    const result = await supertest(app).post("/api/users/otp").send({
      email: "incorrectEmail",
    });

    expect(result.status).toBe(500);
    expect(result.body.error).toBeDefined();
  });
});
