import { quizAPI } from "./api";
import type { Question } from "./types";

export async function generateQuestions(
  leveling: number,
  category: string,
  difficulty: string,
  count: number
): Promise<Question[]> {
  try {
    if (leveling) {
      const levelingQuiz = await quizAPI.getLevelingQuiz();
      console.log({ levelingQuiz });
      return levelingQuiz.data.data;
    }

    const quiz = await quizAPI.getQuiz(category, difficulty, count);
    return quiz.data.data;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
}
