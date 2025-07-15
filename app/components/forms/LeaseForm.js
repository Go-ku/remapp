"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leaseSchema } from "@/lib/validators/leaseSchema";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export function LeaseForm({ action, tenants = [], properties = [] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leaseSchema),
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));
    startTransition(async () => {
      const result = await action(formData);
      if (result?.success === false) {
        toast.error("Validation failed");
      } else if ( result?.success === false && result?.error?.property) {
        toast.error(result.error.property);
      } else {
        toast.success("Lease created");
        router.push("/dashboard/leases");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Select onValueChange={(val) => setValue("property", val)}>
        <SelectTrigger>
          <SelectValue placeholder="Select property" />
        </SelectTrigger>
        <SelectContent>
          {properties.map((p) => (
            <SelectItem key={p._id} value={p._id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.property && (
        <p className="text-red-500 text-sm">{errors.property.message}</p>
      )}

      <Select onValueChange={(val) => setValue("tenant", val)}>
        <SelectTrigger>
          <SelectValue placeholder="Select tenant" />
        </SelectTrigger>
        <SelectContent>
          {tenants.map((t) => (
            <SelectItem key={t._id} value={t._id}>
              {t.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.tenant && (
        <p className="text-red-500 text-sm">{errors.tenant.message}</p>
      )}

      <Input type="date" {...register("startDate")} placeholder="Start date" />
      <Input
        type="date"
        {...register("endDate")}
        placeholder="End date (optional)"
      />
      <Input
        type="number"
        {...register("rentAmount")}
        placeholder="Rent Amount"
      />

      <Select onValueChange={(val) => setValue("paymentFrequency", val)}>
        <SelectTrigger>
          <SelectValue placeholder="Payment Frequency" />
        </SelectTrigger>
        <SelectContent>
          {["monthly", "quarterly", "annually"].map((val) => (
            <SelectItem key={val} value={val}>
              {val}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : "Create Lease"}
      </Button>
    </form>
  );
}
