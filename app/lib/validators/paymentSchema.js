import { z } from "zod";

export const paymentSchema = z.object({
  lease: z.string().min(1, "Lease is required"),
  tenant: z.string().min(1, "Tenant is required"),
  amount: z.coerce.number().gt(0, "Amount must be greater than zero"),
  method: z.enum(["momo", "cash", "bank_transfer"]),
  type: z.enum(["rent", "deposit", "maintenance"]),
});
