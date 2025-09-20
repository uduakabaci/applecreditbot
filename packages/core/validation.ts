import { z } from 'zod';

export const deviceSchema = z.enum(['iPhone', 'iPad', 'Mac']);
export const orderStatusSchema = z.enum(['new', 'in_review', 'approved', 'rejected']);

export const createOrderSchema = z.object({
  telegramChatId: z.number().int(),
  telegramUserId: z.number().int(),
  telegramUsername: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  device: deviceSchema,
  country: z.string().min(1).trim(),
  icloudEmail: z.string().email().toLowerCase().trim(),
  fullName: z.string().min(1).trim(),
  consentGroupInvite: z.boolean(),
  meta: z.record(z.unknown()).optional(),
});

export const updateOrderSchema = z.object({
  status: orderStatusSchema.optional(),
  meta: z.record(z.unknown()).optional(),
});

export const orderIdSchema = z.string().uuid();

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;