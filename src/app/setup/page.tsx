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
        await setupAdmin(formData);
      } catch (err: any) {
        setError(err?.message ?? "Setup failed. Please try again.");
      }
    });
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-gray-200">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">Welcome!</h1>
          <p className="text-gray-400">Let&apos;s set up your admin credentials for the first time. Until this is completed, the portfolio website stays locked.</p>
        </div>

        {error && (
          <div className="mb-4 px-4 py-3 bg-red-900/40 border border-red-700 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Name (Optional)</label>
            <input name="name" className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-gray-600 text-white" placeholder="Ajay Chodankar" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Username</label>
            <input name="username" required minLength={3} className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-gray-600 text-white" placeholder="admin" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
            <input name="email" type="email" required className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-gray-600 text-white" placeholder="admin@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <input
              name="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-gray-600 text-white"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Re-enter Password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className={`w-full px-4 py-3 bg-black border rounded-lg focus:ring-2 focus:outline-none transition-all placeholder:text-gray-600 text-white ${
                confirmTouched
                  ? passwordsMatch
                    ? "border-green-600 focus:ring-green-500"
                    : "border-red-600 focus:ring-red-500"
                  : "border-gray-800 focus:ring-indigo-500"
              }`}
              placeholder="••••••••"
            />
            {confirmTouched && !passwordsMatch && (
              <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
            )}
            {confirmTouched && passwordsMatch && (
              <p className="mt-1 text-xs text-green-400">✓ Passwords match</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending || (confirmTouched && !passwordsMatch)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4"
          >
            {isPending ? "Setting up..." : "Complete Setup"}
          </button>
        </form>
      </div>
    </div>
  );
}
