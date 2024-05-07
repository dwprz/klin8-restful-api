import supertest from "supertest";
import app from "../../src/apps/app/app.js";
import { userTestUtil } from "../user/user-test.util.js";
import { orderTestUtil } from "./order-test.util.js";

// npx jest tests/order/create.test.js

describe("POST /api/orders", () => {
  let userId;
  let userEmail;
  let userFullName;
  let userPassword;
  let userWhatsapp;
  let userAddress;

  let orderId;

  beforeAll(async () => {
    const user = await userTestUtil.createUser();
    userId = user.userId;
    userEmail = user.email;
    userFullName = user.fullName;
    userPassword = user.password;
    userWhatsapp = user.whatsapp;
    userAddress = user.address;
  });

  afterAll(async () => {
    await orderTestUtil.removeOrder(orderId);
    await userTestUtil.removeUser();
  });

  it("create order should be successful", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .post(`/api/orders`)
      .send({
        userId: userId,
        customerName: userFullName,
        itemName: "Sepatu Bola Warna Hitam",
        serviceName: "CLEAN",
        quantity: 1,
        totalPrice: 15000,
        serviceMode: "PICK_UP_ONLY",
        paymentMethod: "E_WALLET",
        whatsapp: userWhatsapp,
        address: userAddress,
      })
      .set("Cookie", cookies);

    orderId = result.body.data.orderId;

    expect(result.status).toBe(201);
    expect(result.body.data).toBeDefined();
  });

  it("create order should fail without accessToken cookie", async () => {
    const result = await supertest(app).post("/api/orders").send({
      userId: userId,
      customerName: userFullName,
      itemName: "Sepatu Bola Warna Hitam",
      serviceName: "CLEAN",
      quantity: 1,
      totalPrice: 15000,
      serviceMode: "PICK_UP_ONLY",
      paymentMethod: "E_WALLET",
      whatsapp: userWhatsapp,
      address: userAddress,
    });

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
