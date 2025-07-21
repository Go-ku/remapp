// app/not-found.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground px-4 text-center">
      <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-3xl font-semibold mb-2">404 – Page Not Found</h1>
      <p className="mb-6 text-muted-foreground max-w-md">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Button asChild>
        <Link href="/">Go back home</Link>
      </Button>
    </div>
  );
}
