import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import {
  getAllInvoices,
  getInvoicesByLandlordId,
} from "@/lib/mongoose/actions/invoiceActions";
import { InvoiceTable } from "@/components/tables/InvoiceTable";
import { getInvoicesByTenantId } from "@/app/lib/actions/invoice";

export default async function InvoicePage() {
  const session = await getServerSession();

  if (!session) redirect("/");

  let invoices = [];

  if (session.user.role === "admin") {
    invoices = await getAllInvoices();
  } else if (session.user.role === "landlord") {
    invoices = await getInvoicesByLandlordId(session.user.id); // assuming user.id = landlordId
  } else if (session.user.role === "tenant") {
    invoices = await getInvoicesByTenantId(session.user.id);
  } else {
    redirect("/dashboard");
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Invoices</h1>
      <InvoiceTable data={invoices} userRole={session.user.role} />
    </div>
  );
}
