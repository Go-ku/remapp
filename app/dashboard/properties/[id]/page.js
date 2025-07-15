import { getPropertyById } from "@/lib/models/property";
import { handleUpdate, handleDelete } from "../actions";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { ConfirmDeleteDialog } from "@/components/modals/ConfirmDeleteDialog";
import { Card, CardContent } from "@/components/ui/card";

export default async function EditPropertyPage({ params }) {
  const property = await getPropertyById(params.id);

  if (!property) return <div>Property not found</div>;

  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <h1 className="text-2xl font-bold">Edit Property</h1>

          <PropertyForm
            action={handleUpdate.bind(null, params.id)}
            defaultValues={{ name: property.name }}
            submitLabel="Update Property"
          />

          <ConfirmDeleteDialog onDelete={handleDelete.bind(null, params.id)} />
        </CardContent>
      </Card>
    </div>
  );
}
