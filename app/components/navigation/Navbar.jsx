"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { navItems } from "@/app/lib/navigation";

export default function Navbar() {
const { data: session, status } = useSession();
  const role = session?.user?.role || "tenant"; // fallback role

  const items = navItems[role] || [];

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        <div className="flex space-x-4">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-gray-700 hover:text-black"
            >
              {item.name}
            </Link>
          ))}
        </div>

        <div>
          <Link href="/api/auth/signout" className="text-sm text-red-500">
            Sign Out
          </Link>
        </div>
      </div>
    </nav>
  );
}
