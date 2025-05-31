"use client";

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
import { Brain, Code } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { categoryAPI } from "@/lib/api";
import { useEffect, useState } from "react";

type Category = {
  id: string;
  name: string;
  description: string;
  questionCount: number;
};

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      try {
        const generatedCategories = await categoryAPI.getCategories();
        console.log({ generatedCategories });

        setCategories(generatedCategories.data.data);
      } catch (error) {
        console.log("Failed to generate questions:", { error });
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link href="/">
                <div className="flex items-center gap-2">
                  <Brain className="h-8 w-8 text-primary" />
                  <h1 className="text-2xl font-bold">Quizly</h1>
                </div>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Brain className="h-16 w-16 text-primary mx-auto animate-pulse" />
            <h2 className="text-2xl font-bold mt-4">Loading Categories...</h2>
            <p className="text-muted-foreground mt-2">
              Our AI is crafting challenging questions just for you
            </p>
          </div>
        </main>
      </div>
    );
  }

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
