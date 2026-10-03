"use client";

import { Button } from "@/components/ui/button";
import { ButtonLink } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setDevLink(null);
    try {
      const res = await fetch("/api/auth/customer/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Request failed");
      setMessage(data.message);
      if (data.resetUrl) setDevLink(data.resetUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="section-padding bg-surface">
      <div className="container-site max-w-md">
        <h1 className="font-display text-3xl font-semibold">Forgot password</h1>
        <p className="mt-2 text-sm text-ink-muted">We will send reset instructions if the email is registered.</p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1.5"
            />
          </div>
          {error ? <p className="text-sm text-red-700">{error}</p> : null}
          {message ? <p className="text-sm text-brand-800">{message}</p> : null}
          {devLink ? (
            <p className="break-all text-xs text-ink-subtle">
              Dev reset link:{" "}
              <a href={devLink} className="text-brand-700 underline">
                {devLink}
              </a>
            </p>
          ) : null}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
        </form>
        <p className="mt-6 text-sm text-ink-muted">
          <ButtonLink href="/account/login" variant="ghost" className="inline px-0">
            Back to login
          </ButtonLink>
        </p>
      </div>
    </div>
  );

}
