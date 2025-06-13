import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/contexts/AuthContext';

export const useUserScore = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-score', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      const response = await fetch(`/api/user-score/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch user score');
      return response.json();
    },
    enabled: !!user?.id,
  });
};

export const useToggleChallengeScore = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ challengeId }: { challengeId: string }) => {
      return apiRequest('/api/toggle-challenge', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.id,
          challengeId
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-score'] });
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
    },
  });
};

export const useSubmitQuizAnswer = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ 
      questionId, 
      selectedAnswer, 
      correctAnswer 
    }: { 
      questionId: string; 
      selectedAnswer: number; 
      correctAnswer: number;
    }) => {
      return apiRequest('/api/submit-quiz-answer', {
        method: 'POST',
        body: JSON.stringify({
          userId: user?.id,
          questionId,
          selectedAnswer,
          correctAnswer
        }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-score'] });
      queryClient.invalidateQueries({ queryKey: ['user-quiz-results'] });
    },
  });
};

export const useGenerateChallenges = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiRequest('/api/generate-challenges', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
    },
  });
};

export const useGenerateQuizQuestions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiRequest('/api/generate-quiz-questions', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] });
    },
  });
};

export const useSeedData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return apiRequest('/api/seed-data', {
        method: 'POST',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['challenges'] });
      queryClient.invalidateQueries({ queryKey: ['quiz-questions'] });
    },
  });
};

export const useApiChallenges = () => {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const response = await fetch('/api/challenges');
      if (!response.ok) throw new Error('Failed to fetch challenges');
      return response.json();
    },
  });
};

export const useApiQuizQuestions = () => {
  return useQuery({
    queryKey: ['quiz-questions'],
    queryFn: async () => {
      const response = await fetch('/api/quiz-questions');
      if (!response.ok) throw new Error('Failed to fetch quiz questions');
      return response.json();
    },
  });
};

export const useUserProgress = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      const response = await fetch(`/api/user-progress/${user.id}`);
      if (!response.ok) throw new Error('Failed to fetch user progress');
      return response.json();
    },
    enabled: !!user?.id,
  });
};