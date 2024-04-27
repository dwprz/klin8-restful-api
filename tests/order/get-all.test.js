import supertest from "supertest";
import app from "../../src/apps/app/app.js";
import { userTestUtil } from "../user/user-test.util.js";
import { orderTestUtil } from "./order-test.util.js";

// npx jest tests/order/get-all.test.js

describe("GET /api/orders", () => {
  let adminEmail;
  let adminPassword;

  let userEmail;
  let userPassword;

  beforeAll(async () => {
    const admin = await userTestUtil.createAdmin();
    adminEmail = admin.email;
    adminPassword = admin.password;

    const user = await userTestUtil.createUser();
    userEmail = user.email;
    userPassword = user.password;

    await orderTestUtil.createOrder(user);
  });

  afterAll(async () => {
    await orderTestUtil.removeOrder();
    await userTestUtil.removeAdmin();
    await userTestUtil.removeUser();
  });

  it("get all orders should be successful", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: adminEmail,
      password: adminPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .get(`/api/orders?page=1`)
      .set("Cookie", cookies);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("get all orders should fail if role is not admin", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .get(`/api/orders?page=1`)
      .set("Cookie", cookies);

    expect(result.status).toBe(403);
    expect(result.body.error).toBeDefined();
  });
});
