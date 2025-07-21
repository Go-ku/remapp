// app/login/page.jsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await signIn("credentials", {
      ...form,
      redirect: false,
    });

    if (res.ok) {
      router.push(callbackUrl);
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white shadow-md rounded-lg p-8 space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Login</h1>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <input
          name="email"
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-md"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-md"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-md hover:opacity-90"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
