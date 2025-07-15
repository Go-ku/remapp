import { getAllLeases } from "@/lib/mongoose/actions/leaseActions";
import { LeaseTable } from "@/components/tables/LeaseTable";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function LeaseListPage() {
  const leases = await getAllLeases();

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Leases</h1>
        <Link href="/dashboard/leases/new">
          <Button>Add New Lease</Button>
        </Link>
      </div>

      <LeaseTable data={leases} />
    </div>
  );
}
