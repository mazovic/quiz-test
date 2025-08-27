"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  User,
  BarChart3,
  Trophy,
  Calendar,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import { userAPI } from "@/lib/api";

export interface UserCategoryScore {
  userId: number;
  firstName: string;
  lastName: string;
  categoryId: number;
  categoryName: string;
  subcategoryId: number;
  subcategoryName: string;
  subcategoryScore: number;
  quizzesTaken: number;
}

export interface UserProfile {
  globalRank: number;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  totalScore: number;
  quizCount: number;
  joinedDate: string;
  userCategoriesScore: UserCategoryScore[];
}

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response: any = await userAPI.getProfile();

        if (response?.data?.data) {
          setProfileData(response.data.data);
        } else {
          throw new Error("Invalid response format");
        }

        console.log(response);
      } catch (err: any) {
        console.error("Failed to fetch user data:", err);
        setError(err.message || "Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading profile data...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !profileData) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-10 w-10 text-destructive" />
            <p className="text-muted-foreground">
              {error || "No profile data available"}
            </p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        </div>
      </Layout>
    );
  }

  const averageScore =
    profileData.quizCount > 0
      ? Number((profileData.totalScore / profileData.quizCount).toFixed(2))
      : 0;

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {/* Profile Header */}
              <div className="bg-card rounded-xl p-6 shadow-sm mb-8 flex flex-col md:flex-row gap-6 items-center md:items-start">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold">
                    {profileData.firstName} {profileData.lastName}
                  </h1>
                  <p className="text-muted-foreground">{profileData.email}</p>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center md:justify-start">
                    <Badge variant="outline" className="gap-1">
                      <Calendar className="h-3 w-3" />
                      Joined{" "}
                      {new Date(profileData.joinedDate).toLocaleDateString()}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Trophy className="h-3 w-3" />
                      {profileData.totalScore.toLocaleString()} points
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <BarChart3 className="h-3 w-3" />
                      {profileData.quizCount} quizzes
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/quiz/new">
                    <Button>Start New Quiz</Button>
                  </Link>
                </div>
              </div>

              {/* Profile Tabs */}
              <div className="flex border-b mb-8">
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "overview"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("overview")}
                >
                  Overview
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "history"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("history")}
                >
                  Quiz History
                </button>
                <button
                  className={`px-4 py-2 font-medium ${
                    activeTab === "achievements"
                      ? "border-b-2 border-primary text-primary"
                      : "text-muted-foreground"
                  }`}
                  onClick={() => setActiveTab("achievements")}
                >
                  Achievements
                </button>
              </div>

              {/* Tab Content */}
              {activeTab === "overview" && (
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Total Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {profileData.totalScore.toLocaleString()}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Quizzes Taken
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {profileData.quizCount}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Average Score
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {averageScore > 0 ? `${averageScore}%` : "N/A"}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                          Global Rank
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-3xl font-bold">
                          {profileData.quizCount > 0
                            ? `#${profileData.globalRank}`
                            : "N/A"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Category Performance */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Category Performance</CardTitle>
                      <CardDescription>
                        Your average scores by category
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.userCategoriesScore.map((category) => (
                          <div key={category.subcategoryId}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium">
                                {`${category.categoryName}-${category.subcategoryName}`}
                              </span>
                              <span className="text-sm font-medium">
                                {category.subcategoryScore /
                                  category.quizzesTaken}
                                %
                              </span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2.5">
                              <div
                                className="bg-primary h-2.5 rounded-full"
                                style={{
                                  width: `${
                                    category.subcategoryScore /
                                    category.quizzesTaken
                                  }%`,
                                }}
                              ></div>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {category.quizzesTaken} quizzes taken
                            </div>
                          </div>
                        ))}
                        {profileData.userCategoriesScore.length === 0 && (
                          <p className="text-muted-foreground text-center py-4">
                            No category data available yet. Take some quizzes to
                            see your performance!
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
