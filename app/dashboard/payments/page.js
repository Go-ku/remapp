import { getAllPayments } from "@/lib/mongoose/actions/paymentActions";
import { PaymentTable } from "@/components/tables/PaymentTable";

export default async function PaymentsPage() {
  const payments = await getAllPayments();

  return (
    <div className="max-w-7xl mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Payments</h1>
      </div>
      <PaymentTable data={payments} />
    </div>
  );
}
