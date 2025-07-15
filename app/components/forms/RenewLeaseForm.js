"use client";

import { useForm } from "react-hook-form";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";

export function RenewLeaseForm({ lease, action }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { register, setValue, handleSubmit } = useForm({
    defaultValues: {
      rentAmount: lease.rentAmount,
      startDate: "",
      endDate: "",
      tenant: lease.tenant._id,
      property: lease.property._id,
      paymentFrequency: lease.paymentFrequency || "monthly",
    },
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, val));
    startTransition(() => action(lease._id, formData));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("startDate")} type="date" placeholder="New Start Date" required />
      <Input {...register("endDate")} type="date" placeholder="New End Date (optional)" />
      <Input {...register("rentAmount")} type="number" placeholder="New Rent" required />

      <Select onValueChange={(val) => setValue("paymentFrequency", val)} defaultValue="monthly">
        <SelectTrigger><SelectValue placeholder="Payment Frequency" /></SelectTrigger>
        <SelectContent>
          {["monthly", "quarterly", "annually"].map((val) => (
            <SelectItem key={val} value={val}>{val}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Renewing..." : "Confirm Renewal"}
      </Button>
    </form>
  );
}
