import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Code,
  Globe,
  Atom,
  Music,
  Film,
  BookOpen,
  Dumbbell,
} from "lucide-react";
import Layout from "@/components/layout/Layout";

const categories = [
  {
    id: "science",
    name: "Science",
    description:
      "Test your knowledge of scientific concepts, discoveries, and theories",
    questionCount: 500,
  },
  {
    id: "technology",
    name: "Technology",
    description:
      "Challenge yourself with questions about gadgets, innovations, and tech history",
    questionCount: 450,
  },
  {
    id: "history",
    name: "History",
    description:
      "Journey through time with questions about historical events and figures",
    questionCount: 600,
  },
  {
    id: "geography",
    name: "Geography",
    description:
      "Explore the world with questions about countries, landmarks, and natural features",
    questionCount: 400,
  },
  {
    id: "entertainment",
    name: "Entertainment",
    description:
      "Test your knowledge of movies, TV shows, music, and pop culture",
    questionCount: 550,
  },
  {
    id: "music",
    name: "Music",
    description: "From classical to contemporary, test your musical knowledge",
    questionCount: 350,
  },
  {
    id: "sports",
    name: "Sports",
    description:
      "Challenge yourself with questions about athletes, teams, and sporting events",
    questionCount: 480,
  },
  {
    id: "general",
    name: "General Knowledge",
    description:
      "A mix of questions from various categories to test your overall knowledge",
    questionCount: 700,
  },
];

export default function CategoriesPage() {
  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Quiz Categories</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Choose from a variety of categories to test your knowledge and
                challenge yourself with AI-generated questions
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Card
                  key={category.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <CardHeader className={`bg-purple-100 dark:bg-purple-900`}>
                    <div className="flex justify-between items-start">
                      <Code className={`h-8 w-8 text-purple-500`} />
                      <Badge variant="secondary">
                        {category.questionCount}+ Questions
                      </Badge>
                    </div>
                    <CardTitle className="mt-4">{category.name}</CardTitle>
                    <CardDescription className="text-foreground/70">
                      {category.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Easy</Badge>
                      <Badge variant="outline">Medium</Badge>
                      <Badge variant="outline">Hard</Badge>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link
                      href={`/quiz/new?category=${category.id}`}
                      className="w-full"
                    >
                      <Button className="w-full">Start Quiz</Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
