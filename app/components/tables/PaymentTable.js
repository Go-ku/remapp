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
import { useEffect } from "react";
export function PaymentTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const formatDate = (date) => {
    try {
      return date ? format(new Date(date), "dd-MM-yyyy") : "—";
    } catch (e) {
      console.error("Date formatting error:", e);
      return "—";
    }
  };

  const filtered = useMemo(() => {
    return (data || []).filter((p) => {
      try {
        const query = globalFilter.toLowerCase();
        return (
          p?.tenant?.name?.toLowerCase().includes(query) ||
          p?.lease?.property?.name?.toLowerCase().includes(query) ||
          p?.receiptNumber?.toLowerCase().includes(query)
        );
      } catch (e) {
        console.error("Filtering error:", e);
        return false;
      }
    });
  }, [globalFilter, data]);

  const columns = useMemo(
    () => [
      {
        id: "receiptNumber",
        header: "Receipt #",
        accessorFn: (row) => row.receiptNumber,
      },
      {
        id: "tenant",
        header: "Tenant",
        accessorFn: (row) => row.tenant?.name || "—",
      },
      {
        id: "property",
        header: "Property",
        accessorFn: (row) => row.lease?.property?.name || "—",
      },
      {
        id: "amount",
        header: "Amount",
        accessorFn: (row) => `ZMW ${row.amount.toLocaleString()}`,
      },
      {
        id: "type",
        header: "Type",
        accessorFn: (row) => row.type,
      },
      {
        id: "method",
        header: "Method",
        accessorFn: (row) => row.method,
      },
      {
        id: "datePaid",
        header: "Date Paid",
        accessorFn: (row) => format(new Date(row.paidAt), "dd-MM-yyyy"),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <Link href={`/dashboard/payments/${row.original._id}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
        ),
      },
      {
        id: "receiptDownload",
        header: "Receipt",
        cell: ({ row }) => {
          const payment = row.original;
          return payment.status === "successful" ? (
            <Button
              variant="secondary"
              size="sm"
              disabled={payment.status !== "successful"}
            >
              Download
            </Button>
          ) : (
            <span className="text-muted-foreground text-xs">Pending</span>
          );
        },
      },
    ],
    []
  );

  const table = useReactTable({
    data,
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
