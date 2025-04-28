"use client"

import { Brain, BarChart3, Trophy } from "lucide-react"
import FeatureCard from "./FeatureCard"

export default function FeaturesSection() {
  const features = [
    {
      icon: Brain,
      title: "AI-Generated Questions",
      description: "Our AI creates fresh, original coding questions that adapt to your skill level and learning pace"
    },
    {
      icon: BarChart3,
      title: "Personalized Learning",
      description: "Track your coding progress and receive personalized recommendations based on your performance"
    },
    {
      icon: Trophy,
      title: "Competitive Leaderboards",
      description: "Compete with fellow coders and climb the global and language-specific leaderboards"
    }
  ]

  return (
    <section className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quizly combines cutting-edge AI with engaging gameplay to create a unique coding quiz experience
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  )
}