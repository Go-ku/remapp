import { getAllTenants } from "@/lib/mongoose/actions/tenantActions";
import { getAllProperties } from "@/lib/mongoose/actions/propertyActions";
import { LeaseForm } from "@/components/forms/LeaseForm";
import { handleCreateLease } from "../actions";
import { Card, CardContent } from "@/components/ui/card";

export default async function NewLeasePage() {
  const tenants = await getAllTenants();
  const properties = await getAllProperties();



  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <h1 className="text-2xl font-bold">New Lease</h1>
          <LeaseForm
            action={handleCreateLease}
            tenants={tenants}
            properties={properties.filter((p) => p.status === "vacant")}
          />
        </CardContent>
      </Card>
    </div>
  );
}
