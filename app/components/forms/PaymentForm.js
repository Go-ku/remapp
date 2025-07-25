"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentSchema } from "@/app/lib/validators/paymentSchema";
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

const PAYMENT_TYPES = [
  { value: "rent", label: "Rent" },
  { value: "deposit", label: "Deposit" },
  { value: "maintenance", label: "Maintenance" },
];

const PAYMENT_METHODS = [
  { value: "momo", label: "MTN MoMo" },
  { value: "cash", label: "Cash" },
  { value: "bank_transfer", label: "Bank Transfer" },
];

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

  const filteredLeases = userRole === "tenant"
    ? leases.filter((l) => l.tenant?._id === tenantId)
    : leases;

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-4">
      {/* Tenant Select (only for non-tenants) */}
      {userRole !== "tenant" && (
        <div className="space-y-2">
          <Select
            onValueChange={(val) => setValue("tenant", val)}
            defaultValue=""
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
        </div>
      )}

      {/* Lease Select */}
      <div className="space-y-2">
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
      </div>

      {/* Amount Input */}
      <div className="space-y-2">
        <Input
          {...register("amount")}
          placeholder="Payment Amount"
          type="number"
          className={errors.amount ? "border-red-500" : ""}
        />
        {errors.amount && (
          <p className="text-sm text-red-500">{errors.amount.message}</p>
        )}
      </div>

      {/* Payment Type */}
      <div className="space-y-2">
        <Select
          onValueChange={(val) => setValue("type", val)}
          defaultValue="rent"
        >
          <SelectTrigger>
            <SelectValue placeholder="Payment Type" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Payment Method */}
      <div className="space-y-2">
        <Select
          onValueChange={(val) => setValue("method", val)}
          defaultValue="momo"
        >
          <SelectTrigger>
            <SelectValue placeholder="Payment Method" />
          </SelectTrigger>
          <SelectContent>
            {PAYMENT_METHODS.map((method) => (
              <SelectItem key={method.value} value={method.value}>
                {method.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Submit Button */}
      <Button 
        type="submit" 
        disabled={isPending} 
        className="w-full mt-6"
        aria-disabled={isPending}
      >
        {isPending ? "Processing..." : "Submit Payment"}
      </Button>
    </form>
  );
}