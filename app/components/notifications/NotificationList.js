// components/notifications/NotificationList.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

export function NotificationList({ fetchNotifications }) {
  const [notifications, setNotifications] = useState([]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetchNotifications().then(setNotifications);
  }, [fetchNotifications]);

  return (
    <div className="relative">
      <Button variant="ghost" onClick={() => setVisible(!visible)} className="relative">
        <Bell className="w-5 h-5" />
        {notifications.some((n) => !n.read) && (
          <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500" />
        )}
      </Button>

      {visible && (
        <div className="absolute right-0 mt-2 w-80 bg-white border shadow-lg rounded-md z-50 max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="p-4 text-sm text-gray-500">No notifications</p>
          ) : (
            notifications.map((n) => (
              <Link
                key={n._id}
                href={n.link || "#"}
                className="block px-4 py-3 hover:bg-gray-100 border-b"
              >
                <p className="text-sm font-medium">{n.message}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(n.createdAt).toLocaleString()}
                </p>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  );
}
