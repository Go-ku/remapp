"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useMemo, useState, useTransition } from "react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DownloadInvoiceButton } from "@/components/buttons/DownloadInvoiceButton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { markInvoiceAsPaid } from "@/lib/mongoose/actions/invoiceActions"; // Create this action

function StatusBadge({ status }) {
  const base = "inline-block px-2 py-0.5 rounded text-xs font-semibold";
  const styles = {
    paid: "bg-green-500 text-white",
    unpaid: "bg-gray-200 text-gray-800",
    overdue: "bg-red-500 text-white",
  };
  return <span className={`${base} ${styles[status]}`}>{status}</span>;
}

export function InvoiceTable({ data, userRole }) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isPending, startTransition] = useTransition();

  const filteredData = useMemo(() => {
    return data.filter((invoice) => {
      if (statusFilter === "all") return true;
      return invoice.status === statusFilter;
    });
  }, [data, statusFilter]);

  const handleMarkAsPaid = (invoiceId) => {
    startTransition(() => {
      markInvoiceAsPaid(invoiceId)
        .then(() => toast.success("Invoice marked as paid"))
        .catch(() => toast.error("Failed to mark invoice as paid"));
    });
  };

  const columns = useMemo(
    () => [
      {
        header: "Invoice #",
        accessorKey: "invoiceNumber",
      },
      {
        header: "Tenant",
        accessorFn: (row) => row.tenant?.name || "—",
      },
      {
        header: "Property",
        accessorFn: (row) => row.property?.name || "—",
      },
      {
        header: "Amount",
        accessorFn: (row) => `ZMW ${row.amount.toLocaleString()}`,
      },
      {
        header: "Due Date",
        accessorFn: (row) => format(new Date(row.dueDate), "dd MMM yyyy"),
      },
      {
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        header: "Actions",
        cell: ({ row }) => {
          const invoice = row.original;

          return (
            <div className="flex gap-2">
              userRole === "admin" || userRole === "landlord" ? ( invoice.status
              !== "paid" ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleMarkAsPaid(invoice._id)}
                disabled={isPending}
              >
                {isPending ? "..." : "Mark as Paid"}
              </Button>
              ) : (<span className="text-sm text-muted-foreground">Paid</span>)
              ) : (<span className="text-sm text-muted-foreground">—</span>
              );
              <DownloadInvoiceButton invoice={invoice} />
            </div>
          );
        },
      },
    ],
    [userRole, isPending]
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: (row, columnId, filterValue) =>
      (row.getValue(columnId) || "")
        .toLowerCase()
        .includes(filterValue.toLowerCase()),
  });

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <Input
          placeholder="Search invoices..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full md:w-64"
        />
        <Select onValueChange={setStatusFilter} defaultValue="all">
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="unpaid">Unpaid</SelectItem>
            <SelectItem value="paid">Paid</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
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
