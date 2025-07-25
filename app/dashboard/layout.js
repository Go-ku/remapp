// import { AppSidebar } from "@/components/app-sidebar"

// import { SiteHeader } from "@/components/site-header"
// import {
//   SidebarInset,
//   SidebarProvider,
// } from "@/components/ui/sidebar"


// export default function DashboardLayout({children}) {
//   return (
//     <SidebarProvider
//       style={
//         {
//           "--sidebar-width": "calc(var(--spacing) * 72)",
//           "--header-height": "calc(var(--spacing) * 12)"
//         }
//       }>
//       <AppSidebar variant="inset" />
//       <SidebarInset>
//         <SiteHeader />
//         <div className="flex flex-1 flex-col">
//           <div className="@container/main flex flex-1 flex-col gap-2">
//             <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
//               {children}
//             </div>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

import Navbar from "../components/navigation/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth/options";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      {/* Top navigation */}
      <Navbar />

      {/* Main content */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
