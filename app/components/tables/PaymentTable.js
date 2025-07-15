"use client";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PaymentTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const filtered = useMemo(() => {
    return data.filter((p) => {
      const query = globalFilter.toLowerCase();
      return (
        p.tenant?.name?.toLowerCase().includes(query) ||
        p.lease?.property?.name?.toLowerCase().includes(query) ||
        p.receiptNumber?.toLowerCase().includes(query)
      );
    });
  }, [globalFilter, data]);

  const columns = useMemo(
    () => [
      {
        header: "Receipt",
        accessorFn: (row) => row.receiptNumber,
      },
      {
        header: "Tenant",
        accessorFn: (row) => row.tenant?.name || "—",
      },
      {
        header: "Property",
        accessorFn: (row) => row.lease?.property?.name || "—",
      },
      {
        header: "Amount",
        accessorFn: (row) => `ZMW ${row.amount.toLocaleString()}`,
      },
      {
        header: "Type",
        accessorFn: (row) => row.type,
      },
      {
        header: "Method",
        accessorFn: (row) => row.method,
      },
      {
        header: "Date Paid",
        accessorFn: (row) => format(new Date(row.paidAt), "dd-MM-yyyy"),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <Link href={`/dashboard/payments/${row.original._id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filtered,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search by tenant/property/receipt..."
        value={globalFilter}
        onChange={(e) => setGlobalFilter(e.target.value)}
        className="w-full md:w-64"
      />

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id} className="border-b">
                {group.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-2 text-left font-medium"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
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
