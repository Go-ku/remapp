// components/tables/RecentPaymentsTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RecentPaymentsTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Tenant</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Method</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell
              colSpan={2}
              className="text-center text-muted-foreground py-4"
            >
              No recent activity to display.
            </TableCell>
          </TableRow>
        ) : (
          data.map((payment) => (
            <TableRow key={payment._id}>
              <TableCell>
                {new Date(payment.paidAt).toLocaleDateString()}
              </TableCell>
              <TableCell>{payment.tenant?.name}</TableCell>
              <TableCell>ZMW {payment.amount.toLocaleString()}</TableCell>
              <TableCell>{payment.method}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
