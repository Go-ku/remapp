"use client";

import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

export default function TenantDashboard({ lease, payments }) {
  const rentDue = lease?.monthlyRent;
  const property = lease?.property?.name;
  const endDate = lease?.endDate
    ? format(new Date(lease.endDate), "PPP")
    : "N/A";

  const isExpired = lease?.endDate && new Date(lease.endDate) < new Date();

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="py-4 space-y-2">
          <h2 className="text-lg font-semibold">My Lease</h2>
          {lease ? (
            <>
              <p>
                <strong>Property:</strong> {property}
              </p>
              <p>
                <strong>Monthly Rent:</strong> ZMW {rentDue}
              </p>
              <p>
                <strong>Lease Ends:</strong> {endDate}
              </p>
              {isExpired && (
                <p className="text-sm text-red-500">
                  ⚠️ Your lease has expired.
                </p>
              )}
            </>
          ) : (
            <p className="text-muted-foreground text-sm">
              No active lease found.
            </p>
          )}

          {lease && (
            <div className="pt-4">
              <Link
                href={`/dashboard/payments/new?leaseId=${lease._id}&amount=${lease.monthlyRent}`}
              >
                <Button size="sm">Pay Rent</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="py-4">
          <h2 className="text-lg font-semibold mb-2">Recent Payments</h2>
          {payments.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No payments recorded yet.
            </p>
          ) : (
            <ul className="space-y-1 text-sm">
              {payments.map((p) => (
                <li key={p._id} className="flex justify-between border-b py-1">
                  <span>{format(new Date(p.paidAt), "dd MMM yyyy")}</span>
                  <span>ZMW {p.amount.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
