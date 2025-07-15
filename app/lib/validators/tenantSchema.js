import { z } from "zod";

export const tenantSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(8).max(15),
  email: z.string().email().optional().or(z.literal("")),
  nationalId: z.string().optional(),
  address: z.string().optional(),
});
