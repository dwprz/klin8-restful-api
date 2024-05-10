import supertest from "supertest";
import app from "../../src/apps/app.js";
import { userTestUtil } from "./user-test.util.js";

// npx jest tests/user/update-photo-profile.test.js

describe("PATCH /api/users/current/photo-profile", () => {
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

  it("update user photo profile should be successful", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .patch(`/api/users/current/photo-profile`)
      .attach("photoProfile", __dirname + "/assets/kurma.jpg")
      .set("Cookie", cookies);

    expect(result.status).toBe(200);
    expect(result.body.error).toBeUndefined();
  });

  it("update user photo profile should fail if file is invalid", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .patch(`/api/users/current/photo-profile`)
      .attach("photoProfile", __dirname + "/assets/invalid-file.jpg")
      .set("Cookie", cookies);

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });

  it("update user photo profile should fail without accessToken cookie", async () => {
    const result = await supertest(app).patch("/api/users/current/password");

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
