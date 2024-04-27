import z from "zod";

const createOrderRequest = z
  .object({
    userId: z.number().min(1).int().nullable().optional(),
    customerName: z.string().max(100),
    itemName: z.string().max(100),
    serviceName: z.enum(["CLEAN", "REPAINT", "REPAIR"]),
    quantity: z.number().min(1).max(100),
    totalPrice: z.number(),
    status: z.enum([
      "PENDING_PICK_UP",
      "IN_PROGRESS",
      "BEING_DELIVERED",
      "READY_FOR_COLLECTION",
      "COMPLETED",
      "CANCELED",
    ]),
    serviceMode: z.enum([
      "REGULAR",
      "PICK_UP_ONLY",
      "DELIVERY_ONLY",
      "PICK_UP_AND_DELIVERY",
    ]),
    paymentMethod: z.enum(["CASH", "BANK_TRANSFER", "E_WALLET"]),
    whatsapp: z.string().max(20).optional(),
    address: z.string().max(500),
  })
  .strict();

const page = z.number().min(1).int();

const getOrdersByCustomerRequest = z.object({
  customerName: z.string().max(100),
  page: z.number().min(1).int(),
});

const getOrdersByStatusRequest = z.object({
  status: z.string().max(25),
  page: z.number().min(1).int(),
});

const getOrdersByCurrentUserRequest = z.object({
  userId: z.number().min(1).int(),
  page: z.number().min(1).int(),
});

const updateStatusRequest = z
  .object({
    orderId: z.number().min(1).int(),
    status: z.enum([
      "PENDING_PICK_UP",
      "IN_PROGRESS",
      "BEING_DELIVERED",
      "READY_FOR_COLLECTION",
      "COMPLETED",
      "CANCELED",
    ]),
  })
  .strict();

const orderId = z.number().min(1).int();

export const orderValidation = {
  createOrderRequest,
  page,
  getOrdersByCustomerRequest,
  getOrdersByStatusRequest,
  getOrdersByCurrentUserRequest,
  updateStatusRequest,
  orderId,
};
