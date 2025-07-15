
import {
  createProperty,
  updateProperty,
  deleteProperty,
} from "@/lib/models/property";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { propertySchema } from "@/app/lib/validators/propertySchema";
import { parse, safeParse } from "zod";

export async function handleCreate(formData) {
    const raw = {name : formData.get("name")}
    const parsed = propertySchema(safeParse(raw))
    if (!parsed.success) {
        return {
            success : false,
            error: parsed.error.flatten().fieldErrors.name?.[0] ?? "Invalid input"
        }
    }


  await createProperty(parsed.data);
  revalidatePath("/dashboard/properties");
  return {success: true}
}

export async function handleUpdate(id, formData) {
  const raw = {
    name: formData.get("name"),
  };

  const parsed = propertySchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors.name?.[0] ?? "Invalid input",
    };
  }

  await updateProperty(id, parsed.data);
  revalidatePath("/dashboard/properties");

  return { success: true };
}

export async function handleDelete(id) {
  await deleteProperty(id);
  revalidatePath("/dashboard/properties");
  redirect("/dashboard/properties");
}
