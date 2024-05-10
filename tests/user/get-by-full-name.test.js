import supertest from "supertest";
import app from "../../src/apps/app.js";
import { userTestUtil } from "./user-test.util.js";

// npx jest tests/user/get-by-full-name.test.js

describe("GET /api/users/full-name/:fullName", () => {
  let adminEmail;
  let adminPassword;
  let adminFullName;

  beforeAll(async () => {
    const admin = await userTestUtil.createAdmin();
    adminEmail = admin.email;
    adminFullName = admin.fullName;
    adminPassword = admin.password;
  });

  afterAll(async () => {
    await userTestUtil.removeAdmin();
  });

  it("get users by full name should be successful", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: adminEmail,
      password: adminPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .get(`/api/users/full-name/${adminFullName}?role=ADMIN&page=1`)
      .set("Cookie", cookies);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.paging).toBeDefined();
  });

  it("get user by full name should fail without accessToken cookie", async () => {
    const result = await supertest(app).get(
      `/api/users/full-name/${adminFullName}?role=ADMIN&page=1`
    );

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
