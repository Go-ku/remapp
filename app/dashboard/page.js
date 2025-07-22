// app/dashboard/page.tsx (admin dashboard)
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { requireRole } from "../lib/auth/helpers";

import { getAdminDashboardData } from "../lib/actions/dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default async function AdminDashboardPage() {
  const session = await requireRole("admin")

  const data = await getAdminDashboardData();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <Separator />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalProperties}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalTenants}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Leases</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalLeases}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">ZMW {data.monthlyRevenue?.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
