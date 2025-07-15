"use client";

import { Card, CardContent } from "@/components/ui/card";

export default function AdminDashboard({ stats }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="py-4">
          <h2 className="text-sm text-muted-foreground">Properties</h2>
          <p className="text-2xl font-bold">{stats.properties}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <h2 className="text-sm text-muted-foreground">Tenants</h2>
          <p className="text-2xl font-bold">{stats.tenants}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <h2 className="text-sm text-muted-foreground">Leases</h2>
          <p className="text-2xl font-bold">{stats.leases}</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <h2 className="text-sm text-muted-foreground">Total Income</h2>
          <p className="text-2xl font-bold">
            ZMW {stats.totalIncome.toLocaleString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
