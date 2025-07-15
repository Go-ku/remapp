import { getTenantById } from "@/lib/mongoose/actions/tenantActions";
import { handleUpdateTenant, handleDeleteTenant } from "../actions";
import { TenantForm } from "@/components/forms/TenantForm";
import { ConfirmDeleteDialog } from "@/components/modals/ConfirmDeleteDialog";
import { Card, CardContent } from "@/components/ui/card";

export default async function EditTenantPage({ params }) {
  const tenant = await getTenantById(params.id);
  if (!tenant) return <div>Not found</div>;

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <h1 className="text-2xl font-bold">Edit Tenant</h1>
          <TenantForm
            action={handleUpdateTenant.bind(null, params.id)}
            defaultValues={tenant}
            submitLabel="Update Tenant"
          />
          <ConfirmDeleteDialog onDelete={handleDeleteTenant.bind(null, params.id)} />
        </CardContent>
      </Card>
    </div>
  );
}
