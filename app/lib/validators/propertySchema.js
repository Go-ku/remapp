import { z } from "zod";

export const propertySchema = z.object({
  name: z.string().min(2, "Property name is too short"),
});
