import supertest from "supertest";
import app from "../../src/apps/app.js";
import { userTestUtil } from "../user/user-test.util.js";
import { orderTestUtil } from "./order-test.util.js";

// npx jest tests/order/get-by-customer.test.js

describe("GET /api/orders/customer/:customerName", () => {
  let adminEmail;
  let adminPassword;

  let userEmail;
  let userPassword;

  let orderId;

  beforeAll(async () => {
    const admin = await userTestUtil.createAdmin();
    adminEmail = admin.email;
    adminPassword = admin.password;

    const user = await userTestUtil.createUser();
    userEmail = user.email;
    userPassword = user.password;

    const order = await orderTestUtil.createOrder(user);
    orderId = order.orderId;
  });

  afterAll(async () => {
    await orderTestUtil.removeOrder(orderId);
    await userTestUtil.removeAdmin();
    await userTestUtil.removeUser();
  });

  it("get orders by customer should be successful", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: adminEmail,
      password: adminPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .get(`/api/orders/customer/user%20test123?page=1`)
      .set("Cookie", cookies);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
    expect(result.body.paging).toBeDefined();
  });

  it("get orders by customer should fail if role is not admin", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .get(`/api/orders/customer/user%20test123?page=1`)
      .set("Cookie", cookies);

    expect(result.status).toBe(403);
    expect(result.body.error).toBeDefined();
  });
});
