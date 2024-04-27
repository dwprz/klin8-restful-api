import supertest from "supertest";
import app from "../../src/apps/app/app.js";
import { userTestUtil } from "./user-test.util.js";

// npx jest tests/user/get-all-by-role.test.js

describe("GET /api/users", () => {
  let adminEmail;
  let adminPassword;

  beforeAll(async () => {
    const admin = await userTestUtil.createAdmin();
    adminEmail = admin.email;
    adminPassword = admin.password;
  });

  afterAll(async () => {
    await userTestUtil.removeAdmin();
  });

  it("get users by role should be successful", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: adminEmail,
      password: adminPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .get(`/api/users?role=admin&page=1`)
      .set("Cookie", cookies);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("get user by role should fail without accessToken cookie", async () => {
    const result = await supertest(app).get("/api/users?role=admin&page=1");

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
