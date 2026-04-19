import { prisma } from "@/lib/prisma";
import { setupAdmin } from "./actions";
import { redirect } from "next/navigation";

export default async function SetupPage() {
  // Check if a user already exists (Security)
  const count = await prisma.user.count();
  if (count > 0) {
    redirect("/api/auth/signin"); // If admin already exists, skip setup and login
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-6 text-gray-200">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 mb-2">Welcome!</h1>
          <p className="text-gray-400">Let's set up your Admin credentials for the first time.</p>
        </div>

        <form action={setupAdmin} className="space-y-5">
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
            <input name="password" type="password" required minLength={6} className="w-full px-4 py-3 bg-black border border-gray-800 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all placeholder:text-gray-600 text-white" placeholder="••••••••" />
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-4">
            Complete Setup
          </button>
        </form>
      </div>
    </div>
  );
}
