// app/dashboard/tenant/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getTenantData } from "@/app/lib/actions/dashboard";
import { PayRentButton } from "@/app/components/buttons/PayRentButton";
import { DownloadReceiptButton } from "@/components/pdf/DownloadReceiptButton";
import { getInvoiceStatus } from "@/app/lib/actions/invoice";

export default async function TenantDashboardPage() {
  const session = await getServerSession(authOptions);
  const tenantId = session.user.tenantId;

  const { lease, invoices, payments } = await getTenantData(tenantId);

  const outstanding = invoices.reduce((sum, inv) => sum + (inv.amount - inv.paidAmount), 0);
  const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-6 p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold">Welcome, {session.user.name}</h1>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-1">Property</h2>
          <p>{lease.property.name}</p>
          <p className="text-sm text-muted-foreground">{lease.startDate} to {lease.endDate || "Ongoing"}</p>
        </div>
        <div className="border rounded p-4">
          <h2 className="font-semibold mb-1">Balance</h2>
          <p className="text-xl font-bold text-red-600">ZMW {outstanding.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Total Paid: ZMW {totalPaid.toLocaleString()}</p>
        </div>
        <div className="flex items-center justify-center">
          <PayRentButton tenant={session.user} lease={lease} />
        </div>
      </section>

      <section>
        <h2 className="font-semibold mb-3 text-lg">Invoices</h2>
        <ul className="divide-y border rounded">
          {invoices.map((inv) => (
            <li key={inv._id} className="flex justify-between items-center p-3">
              <div>
                <p className="font-medium">Invoice #{inv.invoiceNumber}</p>
                <p className="text-sm text-muted-foreground">ZMW {inv.amount} – Status: {getInvoiceStatus(inv)}</p>
              </div>
              <div className="text-right">
                {inv.status === "paid" && <span className="text-green-600 font-semibold">Paid</span>}
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="font-semibold mb-3 text-lg">Recent Payments</h2>
        <ul className="divide-y border rounded">
          {payments.map((p) => (
            <li key={p._id} className="flex justify-between items-center p-3">
              <div>
                <p className="font-medium">ZMW {p.amount} – {new Date(p.paidAt).toLocaleDateString()}</p>
                <p className="text-sm text-muted-foreground">{p.method} – Receipt #{p.receiptNumber}</p>
              </div>
              <DownloadReceiptButton payment={p} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
