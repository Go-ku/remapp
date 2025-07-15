import { getAllLeases } from "@/lib/mongoose/actions/leaseActions";
import { getAllTenants } from "@/lib/mongoose/actions/tenantActions";
import { createPayment } from "@/lib/mongoose/actions/paymentActions";
import { getServerSession } from "next-auth";
import { PaymentForm } from "@/components/forms/PaymentForm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default async function NewPaymentPage({ searchParams }) {
  const leases = await getAllLeases();
  const tenants = await getAllTenants();
  const session = await getServerSession();

  const leaseId = searchParams?.leaseId || "";
  const amount = searchParams?.amount || "";

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
