"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, Award } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { scoreAPI } from "@/lib/api";
import { useEffect, useState } from "react";

interface UserScore {
  userId: number;
  firstName: string;
  lastName: string;
  totalScore: number;
  quizCount: number;
}

interface UserCategoryScore {
  userId: number;
  firstName: string;
  lastName: string;
  categoryId: number;
  categoryName: string;
  categoryScore: number;
}

interface ScoreResponse {
  msg: string;
  data: {
    userScores: UserScore[];
    userCategoryScores: UserCategoryScore[];
  };
}

export default function LeaderboardPage() {
  const [scoreData, setScoreData] = useState<ScoreResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await scoreAPI.listScores();
        setScoreData(response.data);
      } catch (error) {
        console.error("Failed to fetch scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const getCategoryLeaders = () => {
    if (!scoreData?.data.userCategoryScores) return [];

    const categoryMap = new Map();

    scoreData.data.userCategoryScores.forEach((score) => {
      const existing = categoryMap.get(score.categoryName);
      if (!existing || score.categoryScore > existing.categoryScore) {
        categoryMap.set(score.categoryName, {
          category: score.categoryName,
          name: `${score.firstName} ${score.lastName}`,
          score: score.categoryScore,
        });
      }
    });

    return Array.from(categoryMap.values());
  };

  const getLeaderboardData = () => {
    if (!scoreData?.data.userScores) return [];

    return scoreData.data.userScores
      .sort((a, b) => b.totalScore - a.totalScore)
      .map((user, index) => ({
        id: user.userId.toString(),
        name: `${user.firstName} ${user.lastName}`,
        score: user.totalScore,
        quizzesTaken: user.quizCount,
        avatar: `/placeholder.svg?height=40&width=40&query=avatar for ${user.firstName}`,
      }));
  };

  const leaderboardData = getLeaderboardData();
  const categoryLeaders = getCategoryLeaders();

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 py-12">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
                <p className="text-lg text-muted-foreground">
                  Loading scores...
                </p>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    );
  }

  if (!scoreData || !scoreData.data) {
    return (
      <Layout>
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 py-12">
            <div className="container mx-auto px-4">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
                <p className="text-lg text-muted-foreground">
                  Failed to load scores. Please try again later.
                </p>
              </div>
            </div>
          </main>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 py-12">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold mb-4">Leaderboard</h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                See how you stack up against other Quizly players from around
                the world
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Top 3 Players */}
              <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {leaderboardData.slice(0, 3).map((player, index) => (
                  <Card
                    key={player.id}
                    className={`overflow-hidden ${
                      index === 0
                        ? "border-yellow-400 border-2"
                        : index === 1
                        ? "border-gray-400 border-2"
                        : "border-amber-700 border-2"
                    }`}
                  >
                    <div
                      className={`h-2 ${
                        index === 0
                          ? "bg-yellow-400"
                          : index === 1
                          ? "bg-gray-400"
                          : "bg-amber-700"
                      }`}
                    ></div>
                    <CardHeader className="flex flex-row items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          index === 0
                            ? "bg-yellow-100 text-yellow-600"
                            : index === 1
                            ? "bg-gray-100 text-gray-600"
                            : "bg-amber-100 text-amber-600"
                        }`}
                      >
                        {index === 0 ? (
                          <Trophy className="h-6 w-6" />
                        ) : index === 1 ? (
                          <Medal className="h-6 w-6" />
                        ) : (
                          <Award className="h-6 w-6" />
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{player.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Rank #{index + 1}
                        </p>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div>
                          <p className="text-sm text-muted-foreground">Score</p>
                          <p className="text-2xl font-bold">
                            {player.score.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Quizzes
                          </p>
                          <p className="text-2xl font-bold">
                            {player.quizzesTaken}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Main Leaderboard */}
              <div className="md:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Global Rankings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {leaderboardData.map((player, index) => (
                        <div
                          key={player.id}
                          className={`flex items-center gap-4 p-3 rounded-lg ${
                            index < 3 ? "bg-muted/50" : ""
                          }`}
                        >
                          <div className="w-8 text-center font-bold text-muted-foreground">
                            #{index + 1}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{player.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {player.quizzesTaken} quizzes
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              {player.score.toLocaleString()}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              points
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Category Leaders */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Category Champions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {categoryLeaders.map((leader) => (
                        <div
                          key={leader.category}
                          className="p-3 rounded-lg bg-muted/50"
                        >
                          <p className="text-sm text-muted-foreground">
                            {leader.category}
                          </p>
                          <div className="flex justify-between items-center mt-1">
                            <p className="font-medium">{leader.name}</p>
                            <p className="font-bold">
                              {leader.score.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </Layout>
  );
}
