import { 
  users, challenges, userScores, userChallengeProgress, 
  quizQuestions, userQuizResults,
  type User, type InsertUser, type Challenge, type InsertChallenge,
  type QuizQuestion, type InsertQuizQuestion, type UserScore, type InsertUserScore,
  type UserChallengeProgress, type UserQuizResult
} from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // User scores
  getUserScore(userId: string): Promise<UserScore | undefined>;
  createUserScore(userScore: InsertUserScore): Promise<UserScore>;
  updateUserScore(userId: string, points: number, type: 'challenge' | 'quiz'): Promise<UserScore>;

  // Challenges
  getChallenges(): Promise<Challenge[]>;
  getFixedChallenges(): Promise<Challenge[]>;
  createChallenge(challenge: InsertChallenge): Promise<Challenge>;
  clearNonFixedChallenges(): Promise<void>;
  clearAllChallenges(): Promise<void>;

  // Challenge progress
  getUserChallengeProgress(userId: string): Promise<UserChallengeProgress[]>;
  toggleChallengeProgress(userId: string, challengeId: string): Promise<UserChallengeProgress>;

  // Quiz
  getQuizQuestions(): Promise<QuizQuestion[]>;
  createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion>;
  clearQuizQuestions(): Promise<void>;

  // Quiz results
  submitQuizAnswer(userId: string, questionId: string, isCorrect: boolean, pointsEarned: number): Promise<UserQuizResult>;
  getUserQuizResults(userId: string): Promise<UserQuizResult[]>;
}

import { db } from "./db";
import { eq, and } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  // User scores
  async getUserScore(userId: string): Promise<UserScore | undefined> {
    const [score] = await db.select().from(userScores).where(eq(userScores.user_id, userId));
    return score || undefined;
  }

  async createUserScore(userScore: InsertUserScore): Promise<UserScore> {
    const [score] = await db.insert(userScores).values(userScore).returning();
    return score;
  }

  async updateUserScore(userId: string, points: number, type: 'challenge' | 'quiz'): Promise<UserScore> {
    const currentScore = await this.getUserScore(userId);

    if (!currentScore) {
      // Create new score record
      const newScore: InsertUserScore = {
        user_id: userId,
        total_points: points,
        challenge_points: type === 'challenge' ? points : 0,
        quiz_points: type === 'quiz' ? points : 0,
        rank: this.calculateRank(points)
      };
      return this.createUserScore(newScore);
    }

    // Update existing score
    const newTotalPoints = currentScore.total_points + points;
    const newChallengePoints = currentScore.challenge_points + (type === 'challenge' ? points : 0);
    const newQuizPoints = currentScore.quiz_points + (type === 'quiz' ? points : 0);
    const newRank = this.calculateRank(newTotalPoints);

    const [updatedScore] = await db
      .update(userScores)
      .set({
        total_points: newTotalPoints,
        challenge_points: newChallengePoints,
        quiz_points: newQuizPoints,
        rank: newRank,
        updated_at: new Date()
      })
      .where(eq(userScores.user_id, userId))
      .returning();

    return updatedScore;
  }

  private calculateRank(points: number): string {
    if (points >= 500) return 'gold';
    if (points >= 200) return 'silver';
    return 'bronze';
  }

  // Challenges
  async getChallenges(): Promise<Challenge[]> {
    return db.select().from(challenges);
  }

  async getFixedChallenges(): Promise<Challenge[]> {
    return db.select().from(challenges).where(eq(challenges.is_fixed, true));
  }

  async createChallenge(challenge: InsertChallenge): Promise<Challenge> {
    const [newChallenge] = await db.insert(challenges).values(challenge).returning();
    return newChallenge;
  }

  async clearNonFixedChallenges(): Promise<void> {
    // First get the IDs of non-fixed challenges
    const nonFixedChallengeIds = await db.select({ id: challenges.id })
      .from(challenges)
      .where(eq(challenges.is_fixed, false));
    
    // Delete progress for each non-fixed challenge
    for (const challenge of nonFixedChallengeIds) {
      await db.delete(userChallengeProgress).where(
        eq(userChallengeProgress.challenge_id, challenge.id)
      );
    }
    
    // Then delete non-fixed challenges
    await db.delete(challenges).where(eq(challenges.is_fixed, false));
  }

  async clearAllChallenges(): Promise<void> {
    // Delete all user challenge progress first
    await db.delete(userChallengeProgress);
    
    // Then delete all challenges
    await db.delete(challenges);
  }

  // Challenge progress
  async getUserChallengeProgress(userId: string): Promise<UserChallengeProgress[]> {
    return db.select().from(userChallengeProgress).where(eq(userChallengeProgress.user_id, userId));
  }

  async toggleChallengeProgress(userId: string, challengeId: string): Promise<UserChallengeProgress> {
    const [existingProgress] = await db
      .select()
      .from(userChallengeProgress)
      .where(
        and(
          eq(userChallengeProgress.user_id, userId),
          eq(userChallengeProgress.challenge_id, challengeId)
        )
      );

    const [challenge] = await db.select().from(challenges).where(eq(challenges.id, challengeId));

    if (existingProgress) {
      const newCompletedState = !existingProgress.is_completed;
      const pointsEarned = newCompletedState ? challenge.points : -existingProgress.points_earned;

      // Update user score
      if (pointsEarned !== 0) {
        await this.updateUserScore(userId, pointsEarned, 'challenge');
      }

      const [updatedProgress] = await db
        .update(userChallengeProgress)
        .set({
          is_completed: newCompletedState,
          points_earned: newCompletedState ? challenge.points : 0,
          completed_at: newCompletedState ? new Date() : null
        })
        .where(eq(userChallengeProgress.id, existingProgress.id))
        .returning();

      return updatedProgress;
    }

    // Create new progress record
    await this.updateUserScore(userId, challenge.points, 'challenge');

    const [newProgress] = await db
      .insert(userChallengeProgress)
      .values({
        user_id: userId,
        challenge_id: challengeId,
        is_completed: true,
        points_earned: challenge.points,
        completed_at: new Date()
      })
      .returning();

    return newProgress;
  }

  // Quiz
  async getQuizQuestions(): Promise<QuizQuestion[]> {
    return db.select().from(quizQuestions);
  }

  async createQuizQuestion(question: InsertQuizQuestion): Promise<QuizQuestion> {
    const [newQuestion] = await db.insert(quizQuestions).values(question).returning();
    return newQuestion;
  }

  async clearQuizQuestions(): Promise<void> {
    // First delete all user quiz results to avoid foreign key constraint violations
    await db.delete(userQuizResults);
    // Then delete all quiz questions
    await db.delete(quizQuestions);
  }

  // Quiz results
  async submitQuizAnswer(userId: string, questionId: string, isCorrect: boolean, pointsEarned: number): Promise<UserQuizResult> {
    // Update user score if correct
    if (isCorrect && pointsEarned > 0) {
      await this.updateUserScore(userId, pointsEarned, 'quiz');
    }

    const [result] = await db
      .insert(userQuizResults)
      .values({
        user_id: userId,
        question_id: questionId,
        is_correct: isCorrect,
        points_earned: pointsEarned
      })
      .returning();

    return result;
  }

  async getUserQuizResults(userId: string): Promise<UserQuizResult[]> {
    return db.select().from(userQuizResults).where(eq(userQuizResults.user_id, userId));
  }
}

export const storage = new DatabaseStorage();