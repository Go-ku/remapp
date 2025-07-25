import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconBuildingEstate,
  IconUsersGroup,
  IconCash,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

export const navItems = {
    admin: [
      { name: "Dashboard", href: "/dashboard" },
      { name: "Properties", href: "/properties" },
      { name: "Tenants", href: "/tenants" },
      { name: "Invoices", href: "/invoices" },
      { name: "Settings", href: "/settings" },
    ],
  landlord: [
    { name: "Dashboard", href: "/dashboard/landlord", icon: IconDashboard },
    {
      name: "Properties",
      href: "/dashboard/properties",
      icon: IconBuildingEstate,
    },
    { name: "Tenants", href: "/dashboard/tenants", icon: IconUsersGroup },
    { name: "Payments", href: "/dashboard/payments", icon: IconCash },
  ],
  tenant: [
    { name: "Dashboard", href: "/dashboard/tenant" },
    { name: "My Lease", href: "/my-lease" },
    { name: "Invoices", href: "/dashboard/invoices" },
    { name: "Receipts", href: "/dashboard/payments" },
  ],
  "system-admin": [
    { name: "Admin Panel", href: "/dashboard" },
    { name: "Users", href: "/admin/users" },
    { name: "Settings", href: "/admin/settings" },
  ],
};
