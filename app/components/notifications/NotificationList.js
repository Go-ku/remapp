// components/notifications/NotificationList.tsx
"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function NotificationList() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getMyNotifications();
      setNotifications(data);
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-2">
      {notifications.map((n) => (
        <Link key={n._id} href={n.link || "#"} className="block border p-3 rounded hover:bg-muted">
          <p>{n.message}</p>
          <span className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString()}</span>
        </Link>
      ))}
    </div>
  );
}
