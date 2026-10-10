"use client";

import { ButtonLink } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CustomerLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/customer/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: fd.get("email"), password: fd.get("password") }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }
    router.push("/account/bookings");
    router.refresh();
  }

  return (
    <div className="section-padding bg-surface">
      <div className="container-site max-w-md">
        <h1 className="font-display text-3xl font-semibold">Login</h1>
        <form onSubmit={onSubmit} className="glass mt-8 space-y-4 rounded-[1.75rem] p-6">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="mt-1.5" />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <ButtonLink href="/account/forgot-password" variant="ghost" className="h-auto px-0 py-0 text-xs">
                Forgot password?
              </ButtonLink>
            </div>
            <Input id="password" name="password" type="password" required className="mt-1.5" />
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <p className="mt-6 text-sm text-ink-muted">
          No account? <ButtonLink href="/account/register" variant="ghost" className="inline px-0">Register</ButtonLink>
          {" · "}
          <ButtonLink href="/account/lookup" variant="ghost" className="inline px-0">
            Find booking without login
          </ButtonLink>
        </p>
      </div>
    </div>
  );
}
