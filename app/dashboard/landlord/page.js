// app/dashboard/landlord/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getLandlordDashboardData } from "@/lib/mongoose/actions/dashboardActions";
import { getMonthlyRevenueByLandlord } from "@/lib/mongoose/actions/chartActions";
import { getRecentPaymentsByLandlord } from "@/lib/mongoose/actions/paymentActions";
import { getRecentActivityByLandlord } from "@/lib/mongoose/actions/activityActions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import RevenueChart from "@/components/charts/RevenueChart";
import RecentPaymentsTable from "@/components/tables/RecentPaymentsTable";
import RecentActivityTable from "@/components/tables/RecentActivityTable";

export default async function LandlordDashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "landlord") {
    return redirect("/dashboard/unauthorized");
  }

  const [data, revenueData, recentPayments, recentActivities] = await Promise.all([
    getLandlordDashboardData(session.user.id),
    getMonthlyRevenueByLandlord(session.user.id),
    getRecentPaymentsByLandlord(session.user.id),
    getRecentActivityByLandlord(session.user.id),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold">Landlord Dashboard</h1>
        <Separator className="mt-2" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>My Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalProperties}</p>
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
            <CardTitle>My Tenants</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{data.totalTenants}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">ZMW {data.totalRevenue?.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="h-72">
            <RevenueChart data={revenueData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="max-h-72 overflow-auto">
            <RecentActivityTable data={recentActivities} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <RecentPaymentsTable data={recentPayments} />
        </CardContent>
      </Card>
    </div>
  );
}
