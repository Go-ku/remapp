"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "@/lib/validations/paymentSchema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useTransition } from "react";

export function PaymentForm({
  leases,
  tenants,
  onSubmit,
  initialLease = "",
  initialAmount = "",
  userRole,
  tenantId,
}) {
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      lease: initialLease,
      tenant: userRole === "tenant" ? tenantId : "",
      amount: initialAmount,
      method: "momo",
      type: "rent",
    },
  });

  const submit = (data) => {
    startTransition(() => {
      onSubmit(data);
    });
  };

  const filteredLeases =
    userRole === "tenant"
      ? leases.filter((l) => l.tenant?._id === tenantId)
      : leases;

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {/* Tenant Select */}
      {userRole !== "tenant" && (
        <>
          <Select
            onValueChange={(val) => setValue("tenant", val)}
            defaultValue=""
            disabled={userRole !== "tenant"}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Tenant" />
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
            <p className="text-sm text-red-500">{errors.tenant.message}</p>
          )}
        </>
      )}

      {/* Lease Select */}
      <Select
        onValueChange={(val) => setValue("lease", val)}
        defaultValue={initialLease}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Lease" />
        </SelectTrigger>
        <SelectContent>
          {filteredLeases.map((l) => (
            <SelectItem key={l._id} value={l._id}>
              {l.property?.name} – {l.tenant?.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors.lease && (
        <p className="text-sm text-red-500">{errors.lease.message}</p>
      )}

      {/* Amount */}
      <Input
        {...register("amount")}
        placeholder="Payment Amount"
        type="number"
      />
      {errors.amount && (
        <p className="text-sm text-red-500">{errors.amount.message}</p>
      )}

      {/* Type */}
      <Select
        onValueChange={(val) => setValue("type", val)}
        defaultValue="rent"
      >
        <SelectTrigger>
          <SelectValue placeholder="Payment Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="rent">Rent</SelectItem>
          <SelectItem value="deposit">Deposit</SelectItem>
          <SelectItem value="maintenance">Maintenance</SelectItem>
        </SelectContent>
      </Select>

      {/* Method */}
      <Select
        onValueChange={(val) => setValue("method", val)}
        defaultValue="momo"
      >
        <SelectTrigger>
          <SelectValue placeholder="Payment Method" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="momo">MTN MoMo</SelectItem>
          <SelectItem value="cash">Cash</SelectItem>
          <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
        </SelectContent>
      </Select>

      {/* Submit */}
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : "Submit Payment"}
      </Button>
    </form>
  );
}
