"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, ArrowRight, Clock, BarChart3 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { categoryAPI } from "@/lib/api";

export interface SubCategory {
  id: number;
  category_id: number;
  name: string;
  category: {
    name: string;
    id: number;
  };
}

export default function NewQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");

  const [selectedSubCategory, setSelectedSubCategory] = useState<number | null>(
    null
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState("medium");
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(10);
  const [selectedTimeLimit, setSelectedTimeLimit] = useState(60);

  const [loading, setLoading] = useState(true);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);

  useEffect(() => {
    const loadSubCategories = async () => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
      try {
        if (categoryId) {
          const generatedSubCategories =
            await categoryAPI.getSubCategoriesByCategoryId(categoryId);
          console.log({ generatedSubCategories });
          setSubCategories(generatedSubCategories.data.data);
        } else {
          const generatedSubCategories = await categoryAPI.getSubCategories();
          console.log({ generatedSubCategories });
          setSubCategories(generatedSubCategories.data.data);
        }
      } catch (error) {
        console.log("Failed to generate questions:", { error });
      } finally {
        setLoading(false);
      }
    };

    loadSubCategories();
  }, [categoryId]);

  const difficulties = [
    {
      id: "easy",
      name: "Easy",
    },
    {
      id: "medium",
      name: "Medium",
    },
    {
      id: "hard",
      name: "Hard",
    },
  ];

  const questionCounts = [5, 10, 15, 20];
  const timeLimits = [30, 60, 90, 120, 0]; // 0 means no time limit

  const startQuiz = () => {
    if (!selectedSubCategory) {
      // Add validation feedback
      alert("Please select a programming language before starting the quiz");
      return;
    }

    // Add console logging for debugging
    console.log("Starting quiz with:", {
      category: selectedSubCategory,
      difficulty: selectedDifficulty,
      count: selectedQuestionCount,
      time: selectedTimeLimit,
    });

    router.push(
      `/quiz/play?subCategoryId=${selectedSubCategory}&difficulty=${selectedDifficulty}&questionCount=${selectedQuestionCount}&timeLimit=${selectedTimeLimit}`
    );
  };

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
        <main className="flex-1 py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-3xl font-bold mb-8 text-center">
                Create Your Quiz
              </h1>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Select Category</CardTitle>
                  <CardDescription>
                    Choose a category for your quiz questions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {subCategories.map((subCategory) => (
                      <Button
                        key={subCategory.id}
                        variant={
                          selectedSubCategory === subCategory.id
                            ? "default"
                            : "outline"
                        }
                        className="h-auto py-4 flex flex-col gap-2"
                        onClick={() => setSelectedSubCategory(subCategory.id)}
                      >
                        <span className="text-2xl">{subCategory.name}</span>
                        <span>{subCategory.category.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Select Difficulty</CardTitle>
                  <CardDescription>
                    Choose how challenging you want your quiz to be
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {difficulties.map((difficulty) => (
                      <Button
                        key={difficulty.id}
                        variant={
                          selectedDifficulty === difficulty.id
                            ? "default"
                            : "outline"
                        }
                        className="h-auto py-4 flex flex-col gap-2 justify-start items-start text-left"
                        onClick={() => setSelectedDifficulty(difficulty.id)}
                      >
                        <span className="font-bold">{difficulty.name}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Number of Questions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {questionCounts.map((count) => (
                        <Button
                          key={count}
                          variant={
                            selectedQuestionCount === count
                              ? "default"
                              : "outline"
                          }
                          onClick={() => setSelectedQuestionCount(count)}
                        >
                          {count}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Time Limit (seconds)
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {timeLimits.map((time) => (
                        <Button
                          key={time}
                          variant={
                            selectedTimeLimit === time ? "default" : "outline"
                          }
                          onClick={() => setSelectedTimeLimit(time)}
                        >
                          {time === 0 ? "No Limit" : time}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-center">
                <Button
                  size="lg"
                  className="gap-2"
                  onClick={startQuiz}
                  disabled={!selectedSubCategory}
                >
                  Start Quiz
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
