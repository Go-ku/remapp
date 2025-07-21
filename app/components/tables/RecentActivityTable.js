// components/tables/RecentActivityTable.tsx
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function RecentActivityTable({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Activity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.length === 0 ? (
          <TableRow>
            <TableCell colSpan={2} className="text-center text-muted-foreground py-4">
              No recent activity to display.
            </TableCell>
          </TableRow>
        ) : (
          data.map((activity) => (
            <TableRow key={activity._id}>
              <TableCell>{new Date(activity.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>{activity.message}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
