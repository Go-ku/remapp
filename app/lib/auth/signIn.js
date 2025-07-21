import { NextResponse } from "next/server";

export async function signIn({ email, password }) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/auth/callback/credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      csrfToken: "", // leave blank in server-side POST
      email,
      password,
    }),
  });

  const redirectUrl = res.headers.get("location");
  const isError = redirectUrl && redirectUrl.includes("error");

  if (isError) {
    return { error: "Invalid credentials" };
  }

  return { success: true };
}
