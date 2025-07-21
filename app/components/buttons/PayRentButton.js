"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function PayRentButton({ tenant, lease }) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/payments/new?tenant=${tenant._id}&lease=${lease._id}`);
  };

  return (
    <Button onClick={handleClick} className="w-full">
      Pay Rent
    </Button>
  );
}
