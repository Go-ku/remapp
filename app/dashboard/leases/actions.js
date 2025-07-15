"use server";

import { leaseSchema } from "@/lib/validators/leaseSchema";
import { createLease, updateLease } from "@/lib/mongoose/actions/leaseActions";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getPropertyById, updateProperty } from "@/lib/mongoose/actions/propertyActions";


export async function handleCreateLease(formData) {
  const raw = Object.fromEntries(formData.entries());

  const parsed = leaseSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.flatten().fieldErrors,
    };
  }
  // 🔒 Validate property availability
  const property = await getPropertyById(parsed.data.property);
  if (property.status === "occupied") {
    return {
      success: false,
      error: { property: "Property is already occupied" },
    };
  }
  await createLease({
    ...parsed.data,
    startDate: new Date(parsed.data.startDate),
    endDate: parsed.data.endDate ? new Date(parsed.data.endDate) : null,
  });
  await updateProperty(parsed.data.property, { status: "occupied" });

  revalidatePath("/dashboard/leases");
  redirect("/dashboard/leases");
}

export async function handleTerminateLease(id) {
  const today = new Date();
  await updateLease(id, {
    status: "terminated",
    endDate: today,
  });

  // mark property as vacant
  const lease = await getLeaseById(id);
  await updateProperty(lease.property, { status: "vacant" });
  revalidatePath("/dashboard/leases");
  redirect("/dashboard/leases");
}

export async function handleRenewLease(prevLeaseId, formData) {
  const data = Object.fromEntries(formData);
  const newLease = {
    tenant: data.tenant,
    property: data.property,
    rentAmount: Number(data.rentAmount),
    startDate: new Date(data.startDate),
    endDate: data.endDate ? new Date(data.endDate) : null,
    paymentFrequency: data.paymentFrequency || "monthly",
    status: "active",
  };

  await updateLease(prevLeaseId, { status: "terminated", endDate: new Date() });
  await createLease(newLease);

  revalidatePath("/dashboard/leases");
  redirect("/dashboard/leases");
}
