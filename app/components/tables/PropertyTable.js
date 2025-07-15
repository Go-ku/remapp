"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export function PropertyTable({ data }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => info.getValue(),
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <div className="space-x-2">
            <Link href={`/dashboard/properties/${row.original._id}`}>
              <Button variant="outline" size="sm">Edit</Button>
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) => {
      const value = row.getValue(columnId);
      return value?.toLowerCase().includes(filterValue.toLowerCase());
    },
  });

  return (
    <div className="space-y-4">
      {/* 🔍 Search Input */}
      <div className="flex justify-end">
        <Input
          placeholder="Search properties..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b">
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-4 py-2 text-left font-medium">
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
