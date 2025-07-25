import { getAllLeases } from "@/app/lib/actions/lease";
import { getAllTenants } from "@/app/lib/actions/tenant";
import { createPayment } from "@/app/lib/actions/payment";
import { getServerSession } from "next-auth";
import { PaymentForm } from "@/app/components/forms/PaymentForm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default async function NewPaymentPage({ searchParams }) {
  const leases = JSON.parse(JSON.stringify(await getAllLeases()))
  const tenants = JSON.parse(JSON.stringify(await getAllTenants()))
  const session = await getServerSession()

  const leaseId = (await searchParams)?.leaseId || "";
  const amount = (await searchParams)?.amount || "";

  const userRole = session?.user?.role;
  const tenantId = session?.user?.id;

  async function handleSubmit(formData) {
    "use server";

    const receiptNumber = `RCPT-${uuidv4().slice(0, 8).toUpperCase()}`;

    await createPayment({
      ...formData,
      amount: Number(formData.amount),
      receiptNumber,
      paidAt: new Date(),
      status: "successful",
    });

    revalidatePath("/dashboard/payments");
    redirect("/dashboard/payments");
  }

  return (
    <div className="max-w-3xl mx-auto py-10 space-y-6">
      <h1 className="text-2xl font-bold">Record Payment</h1>
      <PaymentForm
        leases={leases}
        tenants={tenants}
        onSubmit={handleSubmit}
        initialLease={leaseId}
        initialAmount={amount}
        userRole={userRole}
        tenantId={tenantId}
      />
    </div>
  );
}
