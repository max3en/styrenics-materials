import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]),
});

export const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.enum(["ADMIN", "EDITOR", "VIEWER"]).optional(),
  password: z.string().min(6).optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brandId: z.string().min(1, "Brand is required"),
  type: z.string().optional().nullable(),
  vicatSofteningTemp: z.coerce.number().optional().nullable(),
  vicatTemp: z.coerce.number().optional().nullable(),
  vicatATemp: z.coerce.number().optional().nullable(),
  vicatB120Temp: z.coerce.number().optional().nullable(),
  mfi220_10: z.coerce.number().optional().nullable(),
  mfi200_5: z.coerce.number().optional().nullable(),
  mfi260_5: z.coerce.number().optional().nullable(),
  izodImpact: z.coerce.number().optional().nullable(),
  charpyImpact: z.coerce.number().optional().nullable(),
  particleSizeRange: z.string().optional().nullable(),
  blowingAgent: z.string().optional().nullable(),
  densityRange: z.string().optional().nullable(),
  mainApplications: z.string().optional().nullable(),
});

export const documentUploadSchema = z.object({
  docType: z.enum(["TDS", "SDS", "REGULATORY"]),
  productId: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ProductInput = z.infer<typeof productSchema>;
