import z from "zod";

const email = z.string().min(5).max(100);

const verifyOtpRequest = z.object({
  email: z.string().min(5).max(100),
  otp: z.string().max(6),
});

const registerRequest = z
  .object({
    email: z.string().min(5).max(100),
    fullName: z.string().min(5).max(100),
    password: z.string().min(5).max(100),
  })
  .strict();

const loginRequest = z.object({
  email: z.string().min(5).max(100),
  password: z.string().min(5).max(100),
});

const loginGoogleRequest = z
  .object({
    email: z.string().min(5).max(100),
    fullName: z.string().min(5).max(100),
    photoProfile: z.string().min(5).max(300).nullable(),
  })
  .strict();

export const authValidation = {
  email,
  verifyOtpRequest,
  registerRequest,
  loginRequest,
  loginGoogleRequest,
};
