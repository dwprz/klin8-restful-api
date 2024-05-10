import supertest from "supertest";
import app from "../../src/apps/app.js";
import { userTestUtil } from "../user/user-test.util.js";
import { orderTestUtil } from "./order-test.util.js";

// npx jest tests/order/get-by-qrcode-token.test.js

describe("GET /api/orders/qrcode-token", () => {
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

  it("get order by qrcode token should be successful", async () => {
    let response = await supertest(app).post("/api/users/login").send({
      email: adminEmail,
      password: adminPassword,
    });

    const cookies = response.get("Set-Cookie");

    response = await supertest(app)
      .post(`/api/orders`)
      .send({
        customerName: "Test",
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
    const qrcodeToken = response.body.qrcodeToken;

    const result = await supertest(app)
      .get("/api/orders/qrcode-token")
      .set("Authorization", qrcodeToken)
      .set("Cookie", cookies);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("get order by qrcode token should fail if qrcode token is invalid", async () => {
    let response = await supertest(app).post("/api/users/login").send({
      email: adminEmail,
      password: adminPassword,
    });

    const cookies = response.get("Set-Cookie");

    const result = await supertest(app)
      .get("/api/orders/qrcode-token")
      .set("Authorization", "INVALID_QRCODE_TOKEN")
      .set("Cookie", cookies);

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
