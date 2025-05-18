"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";

export default function Header() {
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
          <Link href="/profile" className="font-medium hover:text-primary">
            Profile
          </Link>
        </nav>
        <div className="flex gap-2">
          <Link href="/login" passHref>
            <Button variant="outline" as="a">
              Login
            </Button>
          </Link>
          <Link href="/signup" passHref>
            <Button as="a">Sign Up</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
