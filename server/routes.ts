import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertChallengeSchema, insertQuizQuestionSchema, insertUserScoreSchema } from "@shared/schema";
import { generateChallenges, generateQuizQuestions } from "./openai";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // User scores routes
  app.get("/api/user-score/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const score = await storage.getUserScore(userId);
      
      if (!score) {
        // Create initial score for new user
        const newScore = await storage.createUserScore({
          user_id: userId,
          total_points: 0,
          challenge_points: 0,
          quiz_points: 0,
          rank: 'bronze'
        });
        return res.json(newScore);
      }
      
      res.json(score);
    } catch (error) {
      console.error('Error fetching user score:', error);
      res.status(500).json({ error: 'Failed to fetch user score' });
    }
  });

  // Challenges routes
  app.get("/api/challenges", async (req, res) => {
    try {
      const challenges = await storage.getChallenges();
      res.json(challenges);
    } catch (error) {
      console.error('Error fetching challenges:', error);
      res.status(500).json({ error: 'Failed to fetch challenges' });
    }
  });

  app.get("/api/challenges/fixed", async (req, res) => {
    try {
      const challenges = await storage.getFixedChallenges();
      res.json(challenges);
    } catch (error) {
      console.error('Error fetching fixed challenges:', error);
      res.status(500).json({ error: 'Failed to fetch fixed challenges' });
    }
  });

  app.post("/api/challenges", async (req, res) => {
    try {
      const validatedData = insertChallengeSchema.parse(req.body);
      const challenge = await storage.createChallenge(validatedData);
      res.json(challenge);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid challenge data', details: error.errors });
      }
      console.error('Error creating challenge:', error);
      res.status(500).json({ error: 'Failed to create challenge' });
    }
  });

  // Challenge progress routes
  app.get("/api/user-progress/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const progress = await storage.getUserChallengeProgress(userId);
      res.json(progress);
    } catch (error) {
      console.error('Error fetching user progress:', error);
      res.status(500).json({ error: 'Failed to fetch user progress' });
    }
  });

  app.post("/api/toggle-challenge", async (req, res) => {
    try {
      const { userId, challengeId } = req.body;
      if (!userId || !challengeId) {
        return res.status(400).json({ error: 'userId and challengeId are required' });
      }
      
      const progress = await storage.toggleChallengeProgress(userId, challengeId);
      res.json(progress);
    } catch (error) {
      console.error('Error toggling challenge progress:', error);
      res.status(500).json({ error: 'Failed to toggle challenge progress' });
    }
  });

  // Quiz routes
  app.get("/api/quiz-questions", async (req, res) => {
    try {
      const questions = await storage.getQuizQuestions();
      res.json(questions);
    } catch (error) {
      console.error('Error fetching quiz questions:', error);
      res.status(500).json({ error: 'Failed to fetch quiz questions' });
    }
  });

  app.post("/api/quiz-questions", async (req, res) => {
    try {
      const validatedData = insertQuizQuestionSchema.parse(req.body);
      const question = await storage.createQuizQuestion(validatedData);
      res.json(question);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid question data', details: error.errors });
      }
      console.error('Error creating quiz question:', error);
      res.status(500).json({ error: 'Failed to create quiz question' });
    }
  });

  app.post("/api/submit-quiz-answer", async (req, res) => {
    try {
      const { userId, questionId, selectedAnswer, correctAnswer } = req.body;
      
      if (!userId || !questionId || selectedAnswer === undefined || correctAnswer === undefined) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const isCorrect = selectedAnswer === correctAnswer;
      const pointsEarned = isCorrect ? 5 : 0; // Default 5 points per correct answer
      
      const result = await storage.submitQuizAnswer(userId, questionId, isCorrect, pointsEarned);
      res.json(result);
    } catch (error) {
      console.error('Error submitting quiz answer:', error);
      res.status(500).json({ error: 'Failed to submit quiz answer' });
    }
  });

  app.get("/api/user-quiz-results/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const results = await storage.getUserQuizResults(userId);
      res.json(results);
    } catch (error) {
      console.error('Error fetching user quiz results:', error);
      res.status(500).json({ error: 'Failed to fetch user quiz results' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
