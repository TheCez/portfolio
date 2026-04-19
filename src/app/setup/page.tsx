"use client";

import { useState, useTransition } from "react";
import { setupAdmin } from "./actions";

export default function SetupPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const passwordsMatch = password === confirm;
  const confirmTouched = confirm.length > 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!passwordsMatch) {
      setError("Passwords do not match.");
      return;
    }

    setError("");
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = await setupAdmin(formData);
        if (result?.success) {
          window.location.assign("/api/auth/signin?callbackUrl=%2Fadmin");
        }
      } catch (err: any) {
        setError(err?.message ?? "Setup failed. Please try again.");
      }
    });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-6 text-gray-200">
      <div className="w-full max-w-md rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-2 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-3xl font-bold text-transparent">
            Welcome!
          </h1>
          <p className="text-gray-400">
            Let&apos;s set up your admin credentials for the first time. Until this is completed, the portfolio website stays locked.
          </p>
        </div>

        {error ? (
          <div className="mb-4 rounded-lg border border-red-700 bg-red-900/40 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Name (Optional)</label>
            <input
              name="name"
              className="w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white transition-all placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Ajay Chodankar"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Username</label>
            <input
              name="username"
              required
              minLength={3}
              className="w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white transition-all placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Email</label>
            <input
              name="email"
              type="email"
              required
              className="w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white transition-all placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-800 bg-black px-4 py-3 text-white transition-all placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="********"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-300">Re-enter Password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`w-full rounded-lg border bg-black px-4 py-3 text-white transition-all placeholder:text-gray-600 focus:outline-none focus:ring-2 ${
                confirmTouched
                  ? passwordsMatch
                    ? "border-green-600 focus:ring-green-500"
                    : "border-red-600 focus:ring-red-500"
                  : "border-gray-800 focus:ring-indigo-500"
              }`}
              placeholder="********"
            />
            {confirmTouched && !passwordsMatch ? (
              <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
            ) : null}
            {confirmTouched && passwordsMatch ? (
              <p className="mt-1 text-xs text-green-400">Passwords match</p>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={isPending || (confirmTouched && !passwordsMatch)}
            className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-3 font-bold text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Setting up..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
