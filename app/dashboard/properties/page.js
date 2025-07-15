import { getAllProperties } from "@/lib/models/property";
import { PropertyTable } from "@/components/tables/PropertyTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function PropertiesPage() {
  const properties = await getAllProperties();

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Properties</h1>
        <Link href="/dashboard/properties/new">
          <Button>Add New Property</Button>
        </Link>
      </div>

      <PropertyTable data={properties} />
    </div>
  );
}
