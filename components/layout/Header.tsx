"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check if user is logged in when component mounts
  useEffect(() => {
    // This is where you would check for a token, cookie, or other auth state
    // For example:
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    // Clear authentication data
    localStorage.removeItem("token");
    // Update state
    setIsLoggedIn(false);
    // Redirect to home page
    router.push("/");
  };

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold">Quizly</h1>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="font-medium hover:text-primary">
            Home
          </Link>
          <Link href="/categories" className="font-medium hover:text-primary">
            Categories
          </Link>
          <Link href="/leaderboard" className="font-medium hover:text-primary">
            Leaderboard
          </Link>
          <Link href="/resources" className="font-medium hover:text-primary">
            Resources
          </Link>
          {isLoggedIn && (
            <Link href="/profile" className="font-medium hover:text-primary">
              Profile
            </Link>
          )}
        </nav>
        <div className="flex gap-2">
          {isLoggedIn ? (
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Link href="/login" passHref>
                <Button variant="outline" as="a">
                  Login
                </Button>
              </Link>
              <Link href="/signup" passHref>
                <Button as="a">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
