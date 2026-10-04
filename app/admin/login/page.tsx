"use client";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useState } from "react";

export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const fd = new FormData(e.currentTarget);
    let res: Response;
    try {
      res = await fetch("/api/auth/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fd.get("email"),
          password: fd.get("password"),
        }),
      });
    } catch {
      setError("Network error. Try again.");
      return;
    }
    let data: { error?: string } = {};
    try {
      data = await res.json();
    } catch {
      setError(res.ok ? "Unexpected response from server." : `Login failed (${res.status}).`);
      return;
    }
    if (!res.ok) {
      setError(data.error ?? "Login failed");
      return;
    }
    window.location.assign("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-8">
        <h1 className="font-display text-2xl font-semibold">Admin login</h1>
        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="mt-1.5" />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" required className="mt-1.5" />
          </div>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </div>
      </form>
    </div>
  );
}
