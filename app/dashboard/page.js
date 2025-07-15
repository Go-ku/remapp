import { getServerSession } from "next-auth";
import {
  getAdminStats,
  getLandlordStats,
  getTenantStats,
} from "@/lib/mongoose/actions/dashboardStats";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import LandlordDashboard from "@/components/dashboard/LandlordDashboard";
import TenantDashboard from "@/components/dashboard/TenantDashboard";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) return <div>Not logged in</div>;

  const role = session.user.role;

  if (role === "admin") {
    const stats = await getAdminStats();
    return <AdminDashboard stats={stats} />;
  }

  if (role === "landlord") {
    const stats = await getLandlordStats(session.user.id); // assuming session.user.id is landlord _id
    return <LandlordDashboard stats={stats} />;
  }
  if (role === "tenant") {
    const { lease, payments } = await getTenantStats(session.user.id);
    return <TenantDashboard lease={lease} payments={payments} />;
  }
  return <div className="p-6">Dashboard for role: {role} coming soon</div>;
}
