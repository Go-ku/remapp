"use server";

import { tenantSchema } from "@/lib/validators/tenantSchema";
import {
  createTenant,
  updateTenant,
  deleteTenant,
} from "@/lib/mongoose/actions/tenantActions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function handleCreateTenant(formData) {
  const raw = Object.fromEntries(formData);
  const parsed = tenantSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors.name?.[0] || "Invalid input",
    };
  }

  await createTenant(parsed.data);
  revalidatePath("/dashboard/tenants");
  redirect("/dashboard/tenants");
}

export async function handleUpdateTenant(id, formData) {
  const raw = Object.fromEntries(formData);
  const parsed = tenantSchema.safeParse(raw);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors.name?.[0] || "Invalid input",
    };
  }

  await updateTenant(id, parsed.data);
  revalidatePath("/dashboard/tenants");
  redirect("/dashboard/tenants");
}

export async function handleDeleteTenant(id) {
  await deleteTenant(id);
  revalidatePath("/dashboard/tenants");
  redirect("/dashboard/tenants");
}
