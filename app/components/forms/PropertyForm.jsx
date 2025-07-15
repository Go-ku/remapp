"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema } from "@/lib/validators/propertySchema";
import { useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function PropertyForm({ action, defaultValues = {}, submitLabel = "Submit" }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(propertySchema),
    defaultValues,
  });

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);

    startTransition(async () => {
      const result = await action(formData);

      if (result?.success) {
        toast.success("Property saved successfully");
        router.push("/dashboard/properties");
      } else {
        toast.error(result?.error || "Something went wrong");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Property Name</label>
        <Input
          {...register("name")}
          placeholder="Enter property name"
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Submitting..." : submitLabel}
      </Button>
    </form>
  );
}
