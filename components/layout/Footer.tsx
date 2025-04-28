"use client"

import Link from "next/link"
import { Brain } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <Brain className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Quizly</span>
          </div>
          <div className="flex gap-8">
            <Link href="/about" className="text-muted-foreground hover:text-primary">
              About
            </Link>
            <Link href="/privacy" className="text-muted-foreground hover:text-primary">
              Privacy
            </Link>
            <Link href="/terms" className="text-muted-foreground hover:text-primary">
              Terms
            </Link>
            <Link href="/contact" className="text-muted-foreground hover:text-primary">
              Contact
            </Link>
          </div>
        </div>
        <div className="mt-8 text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Quizly. All rights reserved.
        </div>
      </div>
    </footer>
  )
}