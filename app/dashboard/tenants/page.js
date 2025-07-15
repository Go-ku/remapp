import { getAllTenants } from "@/lib/mongoose/actions/tenantActions";
import { TenantTable } from "@/components/tables/TenantTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function TenantListPage() {
  const tenants = await getAllTenants();

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tenants</h1>
        <Link href="/dashboard/tenants/new">
          <Button>Add Tenant</Button>
        </Link>
      </div>
      <TenantTable data={tenants} />
    </div>
  );
}
