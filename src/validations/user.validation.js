import z from "zod";

const getAllByRoleRequest = z.object({
  page: z.number().min(1).int(),
  role: z.string().max(20),
});

const updateUserRequest = z
  .object({
    email: z.string().min(5).max(100),
    fullName: z.string().min(5).max(100).optional(),
    address: z.string().min(5).max(500).optional(),
    whatsapp: z.string().max(20).optional(),
    password: z.string().min(5).max(100),
  })
  .strict();

const updateEmailRequest = z
  .object({
    email: z.string().min(5).max(100),
    newEmail: z.string().min(5).max(100),
    password: z.string().min(5).max(100),
  })
  .strict();

const updatePasswordRequest = z
  .object({
    email: z.string().min(5).max(100),
    newPassword: z.string().min(5).max(100),
    password: z.string().min(5).max(100),
  })
  .strict();

const updatePhotoProfileRequest = z
  .object({
    email: z.string().min(5).max(100),
    photoProfile: z.string().min(50).max(300),
  })
  .strict();

export const userValidation = {
  getAllByRoleRequest,
  updateUserRequest,
  updateEmailRequest,
  updatePasswordRequest,
  updatePhotoProfileRequest,
};
