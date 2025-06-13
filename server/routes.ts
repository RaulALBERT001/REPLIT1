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

  // Seed initial data if empty
  app.post("/api/seed-data", async (req, res) => {
    try {
      const existingChallenges = await storage.getChallenges();
      const existingQuestions = await storage.getQuizQuestions();
      
      let seededData = {
        challenges: [],
        questions: []
      };
      
      // Seed challenges if empty
      if (existingChallenges.length === 0) {
        const defaultChallenges = [
          { challenge: "Reutilize uma embalagem ao invés de descartá-la", points: 5 },
          { challenge: "Caminhe ou use bicicleta para uma viagem curta", points: 8 },
          { challenge: "Apague todas as luzes desnecessárias em casa", points: 6 },
          { challenge: "Separe o lixo reciclável por uma semana", points: 10 },
          { challenge: "Use uma garrafa reutilizável ao invés de comprar água", points: 7 },
          { challenge: "Colete lixo em um espaço público", points: 12 },
          { challenge: "Desligue aparelhos eletrônicos quando não estiver usando", points: 6 },
          { challenge: "Faça uma refeição sem carne hoje", points: 8 }
        ];
        
        for (const challengeData of defaultChallenges) {
          const challenge = await storage.createChallenge({
            challenge: challengeData.challenge,
            is_fixed: true,
            points: challengeData.points
          });
          seededData.challenges.push(challenge);
        }
      }
      
      // Seed quiz questions if empty
      if (existingQuestions.length === 0) {
        const defaultQuestions = [
          {
            question: "Qual é o principal gás responsável pelo efeito estufa?",
            options: ["Oxigênio", "Dióxido de Carbono", "Nitrogênio", "Hidrogênio"],
            correct_answer: 1,
            points: 5
          },
          {
            question: "Quantos anos uma garrafa PET leva para se degradar?",
            options: ["50 anos", "100 anos", "400 anos", "1000 anos"],
            correct_answer: 2,
            points: 5
          },
          {
            question: "Qual cor de lixeira é destinada ao vidro na coleta seletiva?",
            options: ["Verde", "Azul", "Amarelo", "Vermelho"],
            correct_answer: 0,
            points: 5
          }
        ];
        
        for (const questionData of defaultQuestions) {
          const question = await storage.createQuizQuestion({
            question: questionData.question,
            options: questionData.options,
            correct_answer: questionData.correct_answer,
            points: questionData.points
          });
          seededData.questions.push(question);
        }
      }
      
      res.json(seededData);
    } catch (error) {
      console.error('Error seeding data:', error);
      res.status(500).json({ error: 'Failed to seed data' });
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

  // AI Generation routes
  app.post("/api/generate-challenges", async (req, res) => {
    try {
      let generatedChallenges;
      
      try {
        generatedChallenges = await generateChallenges();
      } catch (openaiError) {
        console.warn('OpenAI generation failed, using fallback challenges:', openaiError);
        // Fallback challenges when OpenAI fails
        generatedChallenges = [
          { challenge: "Substitua uma refeição por uma opção mais sustentável hoje", points: 8 },
          { challenge: "Use transporte público ou bicicleta em vez do carro", points: 10 },
          { challenge: "Evite usar produtos descartáveis por um dia inteiro", points: 12 },
          { challenge: "Plante uma semente ou cuide de uma planta", points: 6 },
          { challenge: "Desligue aparelhos eletrônicos da tomada quando não estiver usando", points: 5 }
        ];
      }
      
      // Save generated challenges to database
      const savedChallenges = [];
      for (const challengeData of generatedChallenges) {
        const challenge = await storage.createChallenge({
          challenge: challengeData.challenge,
          is_fixed: false,
          points: challengeData.points
        });
        savedChallenges.push(challenge);
      }
      
      res.json(savedChallenges);
    } catch (error) {
      console.error('Error generating challenges:', error);
      res.status(500).json({ error: 'Failed to generate challenges' });
    }
  });

  app.post("/api/generate-quiz-questions", async (req, res) => {
    try {
      let generatedQuestions;
      
      try {
        generatedQuestions = await generateQuizQuestions();
      } catch (openaiError) {
        console.warn('OpenAI quiz generation failed, using fallback questions:', openaiError);
        // Fallback quiz questions when OpenAI fails
        generatedQuestions = [
          {
            question: "Qual é a principal fonte de energia renovável no Brasil?",
            options: ["Energia solar", "Energia hidrelétrica", "Energia eólica", "Energia nuclear"],
            correct_answer: 1,
            points: 5
          },
          {
            question: "Quanto tempo leva para uma sacola plástica se degradar no meio ambiente?",
            options: ["1-2 anos", "10-20 anos", "100-400 anos", "1000+ anos"],
            correct_answer: 2,
            points: 5
          },
          {
            question: "Qual prática NÃO contribui para a redução do consumo de água?",
            options: ["Tomar banhos mais curtos", "Consertar vazamentos", "Deixar a torneira aberta ao escovar os dentes", "Usar máquina de lavar com carga completa"],
            correct_answer: 2,
            points: 5
          },
          {
            question: "O que significa a sigla 'CO2' no contexto ambiental?",
            options: ["Carbono e Oxigênio", "Dióxido de Carbono", "Monóxido de Carbono", "Carbono Orgânico"],
            correct_answer: 1,
            points: 5
          },
          {
            question: "Qual é a melhor forma de descartar pilhas e baterias?",
            options: ["Lixo comum", "Lixo reciclável", "Pontos de coleta específicos", "Enterrar no quintal"],
            correct_answer: 2,
            points: 5
          }
        ];
      }
      
      // Save generated questions to database
      const savedQuestions = [];
      for (const questionData of generatedQuestions) {
        const question = await storage.createQuizQuestion({
          question: questionData.question,
          options: questionData.options,
          correct_answer: questionData.correct_answer,
          points: questionData.points
        });
        savedQuestions.push(question);
      }
      
      res.json(savedQuestions);
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      res.status(500).json({ error: 'Failed to generate quiz questions' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
