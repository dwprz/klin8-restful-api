import supertest from "supertest";
import app from "../../src/apps/app.js";
import { userTestUtil } from "../user/user-test.util.js";
import { orderTestUtil } from "./order-test.util.js";

// npx jest tests/order/delete.test.js

describe("DELETE /api/orders/:orderId", () => {
  let userEmail;
  let userPassword;

  let orderId;

  beforeAll(async () => {
    const user = await userTestUtil.createUser();
    userEmail = user.email;
    userPassword = user.password;

    const order = await orderTestUtil.createOrder(user);
    orderId = order.orderId;
  });

  afterAll(async () => {
    await orderTestUtil.removeOrder(orderId);
    await userTestUtil.removeUser();
  });

  it("delete order should be successful", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .delete(`/api/orders/${orderId}`)
      .set("Cookie", cookies);

    expect(result.status).toBe(200);
    expect(result.body.error).toBeUndefined();
  });

  it("delete orders should fail without accessToken cookie ", async () => {
    const result = await supertest(app).delete(`/api/orders/${orderId}`);

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
