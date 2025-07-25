import { getAllPayments } from "@/app/lib/actions/payment";
import { PaymentTable } from "@/app/components/tables/PaymentTable";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
export default async function PaymentsPage() {
  const raw = await getAllPayments();
  console.log(raw)
  const payments = JSON.parse(JSON.stringify(raw))
  return (
    <div className="max-w-7xl mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">All Payments</h1>
        <div> 
          <Link href="payments/new">
          <Button href="new" className="bg-zinc-800 text-white"><PlusIcon></PlusIcon> New payment</Button>
        </Link>
        </div>
      </div>
      <PaymentTable data={payments} />
    </div>
  );
}
