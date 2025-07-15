import { handleCreateTenant } from "../actions";
import { TenantForm } from "@/components/forms/TenantForm";
import { Card, CardContent } from "@/components/ui/card";

export default function NewTenantPage() {
  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <h1 className="text-2xl font-bold">Register New Tenant</h1>
          <TenantForm action={handleCreateTenant} />
        </CardContent>
      </Card>
    </div>
  );
}
