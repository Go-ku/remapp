import { handleCreate } from "../actions";
import { PropertyForm } from "@/components/forms/PropertyForm";
import { Card, CardContent } from "@/components/ui/card";

export default function NewPropertyPage() {
  return (
    <div className="max-w-xl mx-auto py-10">
      <Card>
        <CardContent className="space-y-6 pt-6">
          <h1 className="text-2xl font-bold">New Property</h1>
          <PropertyForm
            action={handleCreate}
            submitLabel="Create Property"
          />
        </CardContent>
      </Card>
    </div>
  );
}
