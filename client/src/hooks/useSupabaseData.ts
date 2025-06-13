
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useArticles = () => {
  return useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useChallenges = () => {
  return useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useFixedChallenges = () => {
  return useQuery({
    queryKey: ['challenges', 'fixed'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_fixed', true)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useRandomChallenges = () => {
  return useQuery({
    queryKey: ['challenges', 'random'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_fixed', false);
      
      if (error) throw error;
      return data;
    },
  });
};

export const useUserProgress = () => {
  const { user } = useAuth();
  
  return useQuery({
    queryKey: ['user-progress', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('user_challenge_progress')
        .select('*, challenges(*)')
        .eq('user_id', user.id);
      
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
};

export const useToggleChallengeProgress = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async ({ challengeId, isCompleted }: { challengeId: string; isCompleted: boolean }) => {
      if (!user) throw new Error('User not authenticated');

      if (isCompleted) {
        // Create or update progress
        const { data, error } = await supabase
          .from('user_challenge_progress')
          .upsert({
            user_id: user.id,
            challenge_id: challengeId,
            is_completed: true,
            completed_at: new Date().toISOString(),
          });
        
        if (error) throw error;
        return data;
      } else {
        // Remove progress
        const { error } = await supabase
          .from('user_challenge_progress')
          .delete()
          .eq('user_id', user.id)
          .eq('challenge_id', challengeId);
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-progress'] });
    },
  });
};

export const useQuizQuestions = () => {
  return useQuery({
    queryKey: ['quiz-questions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useCollectionPoints = () => {
  return useQuery({
    queryKey: ['collection-points'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collection_points')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });
};

export const useDailyPhrases = () => {
  return useQuery({
    queryKey: ['daily-phrases'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('daily_phrases')
        .select('*');
      
      if (error) throw error;
      return data;
    },
  });
};
