import { z } from "zod";

export const leaseSchema = z.object({
  property: z.string().min(1),
  tenant: z.string().min(1),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  rentAmount: z.coerce.number().positive(),
  paymentFrequency: z.enum(["monthly", "quarterly", "annually"]),
});
