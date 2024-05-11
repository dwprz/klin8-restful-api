import supertest from "supertest";
import app from "../../src/apps/app.js";
import { userTestUtil } from "../user/user-test.util.js";
import { orderTestUtil } from "./order-test.util.js";

// npx jest tests/order/get-by-order-id.test.js

describe("GET /api/orders/order-id/:orderId", () => {
  let adminEmail;
  let adminPassword;

  let orderId;

  beforeAll(async () => {
    const admin = await userTestUtil.createAdmin();
    adminEmail = admin.email;
    adminPassword = admin.password;
  });

  afterAll(async () => {
    await orderTestUtil.removeOrder(orderId);
    await userTestUtil.removeAdmin();
  });

  it("get order by order id should be successful", async () => {
    let response = await supertest(app).post("/api/users/login").send({
      email: adminEmail,
      password: adminPassword,
    });

    const cookies = response.get("Set-Cookie");

    response = await supertest(app)
      .post(`/api/orders`)
      .send({
        customerName: "User Test123",
        itemName: "Sepatu Bola Warna Hitam",
        serviceName: "CLEAN",
        quantity: 1,
        totalPrice: 15000,
        serviceMode: "PICK_UP_ONLY",
        paymentMethod: "E_WALLET",
        whatsapp: "08123456789",
        address: "Test",
      })
      .set("Cookie", cookies);

    orderId = response.body.data.orderId;

    const result = await supertest(app).get(`/api/orders/order-id/${orderId}`);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("get order by order id should fail if order id is invalid", async () => {
    await supertest(app).post("/api/users/login").send({
      email: adminEmail,
      password: adminPassword,
    });

    const result = await supertest(app).get(
      "/api/orders/order-id/INVALID_ORDER_ID"
    );

    expect(result.status).toBe(400);
    expect(result.body.error).toBeDefined();
  });
});
