import supertest from "supertest";
import app from "../../src/apps/app/app.js";
import { userTestUtil } from "../user/user-test.util.js";
import { orderTestUtil } from "./order-test.util.js";

// npx jest tests/order/get-by-current-user.test.js

describe("GET /api/orders/current-user", () => {
  let userEmail;
  let userPassword;

  beforeAll(async () => {
    const user = await userTestUtil.createUser();
    userEmail = user.email;
    userPassword = user.password;

    await orderTestUtil.createOrder(user);
  });

  afterAll(async () => {
    await orderTestUtil.removeOrder();
    await userTestUtil.removeUser();
  });

  it("get orders by current user should be successful", async () => {
    const loginRes = await supertest(app).post("/api/users/login").send({
      email: userEmail,
      password: userPassword,
    });

    const cookies = loginRes.get("Set-Cookie");

    const result = await supertest(app)
      .get(`/api/orders/current-user?page=1`)
      .set("Cookie", cookies);

    expect(result.status).toBe(200);
    expect(result.body.data).toBeDefined();
  });

  it("get orders by current user should fail without accessToken cookie ", async () => {
    const result = await supertest(app).get(`/api/orders/current-user?page=1`);

    expect(result.status).toBe(401);
    expect(result.body.error).toBeDefined();
  });
});
