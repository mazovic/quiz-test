"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Zap } from "lucide-react"

export default function CTASection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Level Up Your Coding Skills?</h2>
        <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
          Start your first coding quiz now and discover your coding level 
        </p>
        <Link href="/quiz/play?level=1"> 
          <Button size="lg" variant="secondary" className="gap-2">
            <Zap className="h-5 w-5" />
            Start Coding Quiz Now
          </Button>
        </Link>
      </div>
    </section>
  )
}