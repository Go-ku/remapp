import { getLeaseById } from "@/lib/mongoose/actions/leaseActions";
import { handleTerminateLease, handleRenewLease } from "../actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { RenewLeaseForm } from "@/components/forms/RenewLeaseForm";
import { ConfirmTerminateDialog } from "@/components/modals/ConfirmTerminateDialog";

export default async function LeaseDetailPage({ params }) {
  const lease = await getLeaseById(params.id);

  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h1 className="text-xl font-bold">Lease: {lease.property?.name}</h1>
          <p>Tenant: {lease.tenant?.name}</p>
          <p>Rent: ZMW {lease.rentAmount}</p>
          <p>Status: {lease.status}</p>

          {lease.status !== "terminated" && (
            <ConfirmTerminateDialog onConfirm={handleTerminateLease.bind(null, lease._id)} />
          )}
        </CardContent>
      </Card>

      {lease.status === "terminated" && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h2 className="font-bold text-lg">Renew Lease</h2>
            <RenewLeaseForm lease={lease} action={handleRenewLease} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
