// AuthContext (SUPABASE VERSION)
// =================================
// This is the REAL Supabase-backed version that will replace AuthContext.jsx
// when you're ready to go live. The API is identical to the mock version,
// so no other file needs to change.
//
// TO USE THIS FILE:
// 1. Run: npm install @supabase/supabase-js
// 2. Create .env file with:
//      VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
//      VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY
// 3. Rename current AuthContext.jsx → AuthContext.mock.jsx (backup)
// 4. Rename this file → AuthContext.jsx
// 5. Done!

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [childrenList, setChildrenList] = useState([]);
  const [sessions, setSessions] = useState([]);

  // ============================================
  // INITIAL LOAD: check for existing session
  // ============================================
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user && mounted) {
        await loadUserData(session.user);
      }

      if (mounted) setLoading(false);
    };

    init();

    // Listen for auth state changes (sign-in / sign-out)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        await loadUserData(session.user);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
        setChildrenList([]);
        setSessions([]);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Load user profile + children + recent sessions
  const loadUserData = async (authUser) => {
    // 1. Fetch profile (created automatically by DB trigger on signup)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single();

    setUser({
      id: authUser.id,
      email: authUser.email,
      full_name: profile?.full_name || authUser.user_metadata?.full_name || 'משתמש',
      role: profile?.role || 'parent',
      created_at: profile?.created_at,
    });

    // 2. Fetch all children
    const { data: kids } = await supabase
      .from('children')
      .select('*')
      .eq('parent_id', authUser.id)
      .order('created_at', { ascending: false });

    setChildrenList(kids || []);

    // 3. Fetch all reading sessions for this parent's children
    if (kids && kids.length > 0) {
      const childIds = kids.map(c => c.id);
      const { data: sess } = await supabase
        .from('reading_sessions')
        .select('*')
        .in('child_id', childIds)
        .order('created_at', { ascending: false })
        .limit(500);
      setSessions(sess || []);
    }
  };

  // ============================================
  // AUTH METHODS
  // ============================================
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      },
    });
    return { user: data?.user, error };
  };

  // Demo button — uses anonymous sign-in if enabled, or guides to Google
  const signInDemo = async () => {
    // Supabase has anonymous auth — enable it in Auth → Providers → Anonymous
    const { data, error } = await supabase.auth.signInAnonymously();
    if (data?.user) {
      await loadUserData(data.user);
    }
    return { user: data?.user, error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // ============================================
  // CHILDREN METHODS
  // ============================================
  const getChildren = () => childrenList;

  const getChild = (childId) => childrenList.find(c => c.id === childId);

  const addChild = async (childData) => {
    if (!user) return { error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('children')
      .insert({
        parent_id: user.id,
        name: childData.name,
        age: childData.age,
        grade: childData.grade || null,
        reading_level: childData.reading_level || 1,
        avatar_emoji: childData.avatar_emoji || '👧',
        interests: childData.interests || [],
      })
      .select()
      .single();

    if (!error && data) {
      setChildrenList(prev => [data, ...prev]);
    }
    return { data, error };
  };

  const updateChild = async (childId, updates) => {
    const { data, error } = await supabase
      .from('children')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', childId)
      .select()
      .single();

    if (!error && data) {
      setChildrenList(prev => prev.map(c => c.id === childId ? data : c));
    }
    return { data, error };
  };

  const deleteChild = async (childId) => {
    const { error } = await supabase.from('children').delete().eq('id', childId);
    if (!error) {
      setChildrenList(prev => prev.filter(c => c.id !== childId));
      setSessions(prev => prev.filter(s => s.child_id !== childId));
    }
    return { error };
  };

  // ============================================
  // READING SESSIONS METHODS
  // ============================================
  const getSessions = (childId) => {
    return sessions
      .filter(s => s.child_id === childId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const addSession = async (sessionData) => {
    const { data, error } = await supabase
      .from('reading_sessions')
      .insert({
        child_id: sessionData.child_id,
        story_id: sessionData.story_id || null,
        wcpm: sessionData.wcpm || 0,
        accuracy: sessionData.accuracy || 0,
        total_words: sessionData.total_words || 0,
        correct_words: sessionData.correct_words || 0,
        errors_count: sessionData.errors_count || 0,
        hints_used: sessionData.hints_used || 0,
        duration_seconds: sessionData.duration_seconds || 0,
        completed: sessionData.completed || false,
        errors_detail: sessionData.errors_detail || [],
      })
      .select()
      .single();

    if (!error && data) {
      // Tack on story_title for UI convenience (not stored in DB — comes from stories.js)
      const enriched = { ...data, story_title: sessionData.story_title };
      setSessions(prev => [enriched, ...prev]);
    }
    return { data, error };
  };

  const resetAllData = async () => {
    await signOut();
  };

  // ============================================
  // CUSTOM STORIES METHODS
  // ============================================
  // Stories that parents create themselves (paste/URL/file imports).
  // Stored in a 'custom_stories' table when using Supabase.
  // For now while we don't have that table yet, we keep them in localStorage
  // as a graceful fallback so the swap from mock auth doesn't break this feature.
  const [customStories, setCustomStories] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('readright_custom_stories') || '[]');
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('readright_custom_stories', JSON.stringify(customStories));
  }, [customStories]);

  const getCustomStories = (childId) => {
    if (childId === undefined) return customStories;
    return customStories.filter(s => s.childId === childId);
  };

  const getCustomStory = (storyId) => customStories.find(s => s.id === storyId);

  const addCustomStory = async (story) => {
    setCustomStories(prev => [story, ...prev]);
    return { data: story, error: null };
  };

  const deleteCustomStory = async (storyId) => {
    setCustomStories(prev => prev.filter(s => s.id !== storyId));
    return { error: null };
  };

  const updateCustomStory = async (storyId, updates) => {
    let updated = null;
    setCustomStories(prev => prev.map(s => {
      if (s.id === storyId) {
        updated = { ...s, ...updates };
        return updated;
      }
      return s;
    }));
    return { data: updated, error: null };
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signInDemo,
    signOut,
    getChildren,
    getChild,
    addChild,
    updateChild,
    deleteChild,
    getSessions,
    addSession,
    getCustomStories,
    getCustomStory,
    addCustomStory,
    deleteCustomStory,
    updateCustomStory,
    resetAllData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
