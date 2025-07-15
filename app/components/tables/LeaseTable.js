"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { format, differenceInDays, isAfter } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import Link from "next/link";

function getStatusTag(startDate, endDate) {
  const now = new Date();

  if (!endDate) return { label: "Active", color: "default" };

  const daysLeft = differenceInDays(new Date(endDate), now);

  if (daysLeft < 0) return { label: "Expired", color: "destructive" };
  if (daysLeft <= 30) return { label: "Expiring", color: "warning" };

  return { label: "Active", color: "default" };
}

function StatusBadge({ status }) {
  const base = "inline-block px-2 py-0.5 rounded text-xs font-semibold";
  const styles = {
    default: "bg-gray-200 text-gray-800",
    warning: "bg-yellow-300 text-yellow-800",
    destructive: "bg-red-500 text-white",
  };
  return <span className={`${base} ${styles[status.color]}`}>{status.label}</span>;
}

export function LeaseTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [expiryFilter, setExpiryFilter] = useState("all");

  const filteredData = useMemo(() => {
    const now = new Date();
    return data.filter((lease) => {
      const end = lease.endDate ? new Date(lease.endDate) : null;
      if (expiryFilter === "expiring" && end) {
        const daysLeft = differenceInDays(end, now);
        return daysLeft <= 30 && daysLeft >= 0;
      }
      if (expiryFilter === "expired" && end) return isAfter(now, end);
      if (expiryFilter === "active") return !end || isAfter(end, now);
      return true;
    });
  }, [data, expiryFilter]);

  const columns = useMemo(() => [
    {
      header: "Tenant",
      accessorFn: (row) => row.tenant?.name || "—",
    },
    {
      header: "Property",
      accessorFn: (row) => row.property?.name || "—",
    },
    {
      header: "Rent",
      accessorFn: (row) => `ZMW ${row.rentAmount.toLocaleString()}`,
    },
    {
      header: "Period",
      accessorFn: (row) => {
        const start = format(new Date(row.startDate), "yyyy-MM-dd");
        const end = row.endDate ? format(new Date(row.endDate), "yyyy-MM-dd") : "Ongoing";
        return `${start} → ${end}`;
      },
    },
    {
      header: "Status",
      cell: ({ row }) => {
        const tag = getStatusTag(row.original.startDate, row.original.endDate);
        return <StatusBadge status={tag} />;
      },
    },
    {
      header: "Actions",
      cell: ({ row }) => (
        <Link href={`/dashboard/leases/${row.original._id}`}>
          <Button variant="outline" size="sm">View</Button>
        </Link>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) =>
      (row.getValue(columnId) || "").toLowerCase().includes(filterValue.toLowerCase()),
  });

  return (
    <div className="space-y-4">
      {/* 🔍 Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <Input
          placeholder="Search tenants/properties..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full md:w-64"
        />
        <Select onValueChange={setExpiryFilter} defaultValue="all">
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter leases" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="expiring">Expiring in 30 days</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 📋 Table */}
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className="border-b">
                {group.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left font-medium">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-b hover:bg-accent">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
