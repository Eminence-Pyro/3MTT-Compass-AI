
import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User as AppUser, Achievement, LearningModule } from '../types/index';

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        
        if (session?.user) {
          // Fetch user profile from our profiles table
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            // Get the current learning path if it exists
            const { data: learningPath } = await supabase
              .from('learning_paths')
              .select('*')
              .eq('user_id', session.user.id)
              .maybeSingle();

            const appUser: AppUser = {
              id: profile.id,
              email: profile.email,
              name: profile.name,
              track: profile.track || '',
              assessmentCompleted: profile.assessment_completed,
              skillLevel: profile.skill_level as 'beginner' | 'intermediate' | 'advanced',
              completedModules: profile.completed_modules || [],
              achievements: (profile.achievements as unknown as Achievement[]) || [],
              totalPoints: profile.total_points || 0,
              currentPath: learningPath ? {
                id: learningPath.id,
                userId: learningPath.user_id,
                track: learningPath.track,
                modules: (learningPath.modules as unknown as LearningModule[]) || [],
                progress: learningPath.progress,
                adaptationHistory: learningPath.adaptation_history || [],
                createdAt: learningPath.created_at
              } : null
            };
            setUser(appUser);
          }
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      // This will trigger the auth state change handler above
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string, name: string) => {
    setLoading(true);
    
    // First try to sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError && signInError.message.includes('Invalid login credentials')) {
      // If sign in fails, try to sign up
      const redirectUrl = `${window.location.origin}/`;
      
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            name: name
          }
        }
      });

      if (signUpError) {
        // If signup fails because user already exists, it means they provided wrong password
        if (signUpError.message.includes('User already registered')) {
          setLoading(false);
          throw new Error('This email is already registered. Please sign in with your password.');
        }
        setLoading(false);
        throw signUpError;
      }

      // If signup was successful but user needs email confirmation
      if (signUpData.user && !signUpData.session) {
        setLoading(false);
        // For demo purposes, we'll continue without email confirmation
        // In production, you'd want to handle email confirmation properly
        return;
      }
    } else if (signInError) {
      setLoading(false);
      throw signInError;
    }

    setLoading(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  const updateUser = async (updates: Partial<AppUser>) => {
    if (!user || !session?.user) return;

    // Update the profiles table
    const profileUpdates = {
      track: updates.track,
      assessment_completed: updates.assessmentCompleted,
      skill_level: updates.skillLevel,
      completed_modules: updates.completedModules,
      achievements: updates.achievements ? JSON.parse(JSON.stringify(updates.achievements)) : undefined,
      total_points: updates.totalPoints,
      updated_at: new Date().toISOString()
    };

    const { error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdates)
      .eq('id', user.id);

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return;
    }

    // Update learning path if provided
    if (updates.currentPath) {
      const learningPathData = {
        track: updates.currentPath.track,
        modules: JSON.parse(JSON.stringify(updates.currentPath.modules)),
        progress: updates.currentPath.progress,
        adaptation_history: updates.currentPath.adaptationHistory,
        updated_at: new Date().toISOString()
      };

      if (user.currentPath) {
        // Update existing learning path
        const { error: pathError } = await supabase
          .from('learning_paths')
          .update(learningPathData)
          .eq('id', user.currentPath.id);

        if (pathError) {
          console.error('Error updating learning path:', pathError);
          return;
        }
      } else {
        // Create new learning path
        const { error: pathError } = await supabase
          .from('learning_paths')
          .insert({
            ...learningPathData,
            user_id: user.id
          });

        if (pathError) {
          console.error('Error creating learning path:', pathError);
          return;
        }
      }
    }

    // Update local state
    setUser(prev => prev ? { ...prev, ...updates } : null);
  };

  return {
    user,
    loading,
    login,
    logout,
    updateUser
  };
}
