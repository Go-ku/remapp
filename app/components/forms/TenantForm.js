"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tenantSchema } from "@/lib/validators/tenantSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function TenantForm({ action, submitLabel = "Create Tenant", defaultValues = {} }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tenantSchema),
    defaultValues,
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, val]) => formData.append(key, val));

    startTransition(async () => {
      const result = await action(formData);

      if (result?.success === false) {
        toast.error(result.error);
      } else {
        toast.success("Tenant saved");
        router.push("/dashboard/tenants");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input {...register("name")} placeholder="Name" />
      {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

      <Input {...register("phone")} placeholder="Phone" />
      <Input {...register("email")} placeholder="Email (optional)" />
      <Input {...register("nationalId")} placeholder="National ID (optional)" />
      <Input {...register("address")} placeholder="Address (optional)" />

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </form>
  );
}
