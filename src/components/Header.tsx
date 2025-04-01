"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function Header() {
  const { user, supabase } = useAuth();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold">
              jumpscares
            </Link>
            <Link href="/rooms" className="hover:text-gray-300">
              Rooms
            </Link>
          </div>

          <div>
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Hello, {user.email}!</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
                >
                  Log Out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
              >
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
