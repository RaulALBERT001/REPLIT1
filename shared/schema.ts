import { pgTable, text, serial, integer, boolean, uuid, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Articles table
export const articles = pgTable("articles", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Challenges table
export const challenges = pgTable("challenges", {
  id: uuid("id").primaryKey().defaultRandom(),
  challenge: text("challenge").notNull(),
  is_fixed: boolean("is_fixed").default(true).notNull(),
  points: integer("points").default(10).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// User scores table
export const userScores = pgTable("user_scores", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id").notNull(), // Supabase user ID
  total_points: integer("total_points").default(0).notNull(),
  challenge_points: integer("challenge_points").default(0).notNull(),
  quiz_points: integer("quiz_points").default(0).notNull(),
  rank: text("rank").default("bronze").notNull(), // bronze, silver, gold
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

// User challenge progress table
export const userChallengeProgress = pgTable("user_challenge_progress", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id").notNull(),
  challenge_id: uuid("challenge_id").notNull().references(() => challenges.id),
  is_completed: boolean("is_completed").default(false).notNull(),
  points_earned: integer("points_earned").default(0).notNull(),
  completed_at: timestamp("completed_at"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Quiz questions table
export const quizQuestions = pgTable("quiz_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  question: text("question").notNull(),
  options: jsonb("options").notNull(),
  correct_answer: integer("correct_answer").notNull(),
  points: integer("points").default(5).notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// User quiz results table
export const userQuizResults = pgTable("user_quiz_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  user_id: text("user_id").notNull(),
  question_id: uuid("question_id").notNull().references(() => quizQuestions.id),
  is_correct: boolean("is_correct").notNull(),
  points_earned: integer("points_earned").default(0).notNull(),
  answered_at: timestamp("answered_at").defaultNow().notNull(),
});

// Collection points table
export const collectionPoints = pgTable("collection_points", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  waste_types: jsonb("waste_types").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

// Daily phrases table
export const dailyPhrases = pgTable("daily_phrases", {
  id: uuid("id").primaryKey().defaultRandom(),
  phrase: text("phrase").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertChallengeSchema = createInsertSchema(challenges).pick({
  challenge: true,
  is_fixed: true,
  points: true,
});

export const insertQuizQuestionSchema = createInsertSchema(quizQuestions).pick({
  question: true,
  options: true,
  correct_answer: true,
  points: true,
});

export const insertUserScoreSchema = createInsertSchema(userScores).pick({
  user_id: true,
  total_points: true,
  challenge_points: true,
  quiz_points: true,
  rank: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Article = typeof articles.$inferSelect;
export type Challenge = typeof challenges.$inferSelect;
export type InsertChallenge = z.infer<typeof insertChallengeSchema>;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type InsertQuizQuestion = z.infer<typeof insertQuizQuestionSchema>;
export type UserScore = typeof userScores.$inferSelect;
export type InsertUserScore = z.infer<typeof insertUserScoreSchema>;
export type UserChallengeProgress = typeof userChallengeProgress.$inferSelect;
export type UserQuizResult = typeof userQuizResults.$inferSelect;
export type CollectionPoint = typeof collectionPoints.$inferSelect;
export type DailyPhrase = typeof dailyPhrases.$inferSelect;
