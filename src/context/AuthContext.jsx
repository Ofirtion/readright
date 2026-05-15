// Mock Auth Context — simulates Supabase auth until we connect the real thing.
// All data persists in localStorage so it survives page reloads.
// When we connect Supabase, only this file changes — every other file stays the same.

import React, { createContext, useContext, useState, useEffect } from 'react';
import { startTrial, clearSubscription } from '../lib/subscription';
import { identifyUser, resetUser, track, EVENTS } from '../lib/analytics';
import { identifyUserForErrors, clearUserForErrors } from '../lib/errorTracking';

const AuthContext = createContext(null);

// LocalStorage keys
const KEYS = {
  USER: 'readright_user',
  CHILDREN: 'readright_children',
  SESSIONS: 'readright_sessions',
  CUSTOM_STORIES: 'readright_custom_stories',
};

// Generate a unique ID (mimics Supabase UUIDs)
const uid = () => `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [childrenList, setChildrenList] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [customStories, setCustomStories] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem(KEYS.USER);
      const savedChildren = localStorage.getItem(KEYS.CHILDREN);
      const savedSessions = localStorage.getItem(KEYS.SESSIONS);
      const savedCustomStories = localStorage.getItem(KEYS.CUSTOM_STORIES);

      if (savedUser) setUser(JSON.parse(savedUser));
      if (savedChildren) setChildrenList(JSON.parse(savedChildren));
      if (savedSessions) setSessions(JSON.parse(savedSessions));
      if (savedCustomStories) setCustomStories(JSON.parse(savedCustomStories));
    } catch (e) {
      console.error('Failed to load auth state', e);
    }
    setLoading(false);
  }, []);

  // Persist to localStorage whenever state changes
  useEffect(() => {
    if (user) localStorage.setItem(KEYS.USER, JSON.stringify(user));
    else localStorage.removeItem(KEYS.USER);
  }, [user]);

  useEffect(() => {
    localStorage.setItem(KEYS.CHILDREN, JSON.stringify(childrenList));
  }, [childrenList]);

  useEffect(() => {
    localStorage.setItem(KEYS.SESSIONS, JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem(KEYS.CUSTOM_STORIES, JSON.stringify(customStories));
  }, [customStories]);

  // ============================================
  // AUTH METHODS (mimics Supabase API)
  // ============================================

  const signInWithGoogle = async () => {
    const mockUser = {
      id: uid(),
      email: 'demo@readright.app',
      full_name: 'הורה לדוגמה',
      role: 'parent',
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    startTrial();
    identifyUser(mockUser);
    identifyUserForErrors(mockUser);
    track(EVENTS.SIGNED_IN, { method: 'google' });
    return { user: mockUser, error: null };
  };

  const signInDemo = async (name = 'הורה לדוגמה') => {
    const mockUser = {
      id: uid(),
      email: 'demo@readright.app',
      full_name: name,
      role: 'parent',
      created_at: new Date().toISOString(),
    };
    setUser(mockUser);
    startTrial();
    identifyUser(mockUser);
    identifyUserForErrors(mockUser);
    track(EVENTS.SIGNED_IN, { method: 'demo' });
    return { user: mockUser, error: null };
  };

  const signOut = async () => {
    track(EVENTS.SIGNED_OUT);
    setUser(null);
    resetUser();
    clearUserForErrors();
    // We keep children/sessions data so user doesn't lose it on logout
  };

  // ============================================
  // CHILDREN METHODS (mimics Supabase children table)
  // ============================================

  const getChildren = () => {
    if (!user) return [];
    return childrenList.filter(c => c.parent_id === user.id);
  };

  const getChild = (childId) => {
    return childrenList.find(c => c.id === childId);
  };

  const addChild = async (childData) => {
    const newChild = {
      id: uid(),
      parent_id: user.id,
      name: childData.name,
      age: childData.age,
      grade: childData.grade || null,
      reading_level: childData.reading_level || 1,
      avatar_emoji: childData.avatar_emoji || '👧',
      interests: childData.interests || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setChildrenList(prev => [...prev, newChild]);
    return { data: newChild, error: null };
  };

  const updateChild = async (childId, updates) => {
    setChildrenList(prev => prev.map(c =>
      c.id === childId
        ? { ...c, ...updates, updated_at: new Date().toISOString() }
        : c
    ));
    return { error: null };
  };

  const deleteChild = async (childId) => {
    setChildrenList(prev => prev.filter(c => c.id !== childId));
    setSessions(prev => prev.filter(s => s.child_id !== childId));
    return { error: null };
  };

  // ============================================
  // READING SESSIONS METHODS
  // ============================================

  const getSessions = (childId) => {
    return sessions.filter(s => s.child_id === childId).sort((a, b) =>
      new Date(b.created_at) - new Date(a.created_at)
    );
  };

  const addSession = async (sessionData) => {
    const newSession = {
      id: uid(),
      child_id: sessionData.child_id,
      story_id: sessionData.story_id,
      story_title: sessionData.story_title,
      wcpm: sessionData.wcpm || 0,
      accuracy: sessionData.accuracy || 0,
      total_words: sessionData.total_words || 0,
      correct_words: sessionData.correct_words || 0,
      errors_count: sessionData.errors_count || 0,
      hints_used: sessionData.hints_used || 0,
      duration_seconds: sessionData.duration_seconds || 0,
      completed: sessionData.completed || false,
      errors_detail: sessionData.errors_detail || [],
      created_at: new Date().toISOString(),
    };
    setSessions(prev => [...prev, newSession]);
    return { data: newSession, error: null };
  };

  // ============================================
  // CUSTOM STORIES METHODS
  // ============================================
  // Stories that the parent imported themselves (paste/URL/file).
  // Stored per-parent in localStorage; in Supabase version, will be in a 'user_stories' table.

  // Returns all custom stories owned by this parent.
  // If childId is provided, returns only stories created for that child.
  const getCustomStories = (childId) => {
    if (childId === undefined) return customStories;
    return customStories.filter(s => s.childId === childId);
  };

  const getCustomStory = (storyId) => customStories.find(s => s.id === storyId);

  // story.childId should be set before calling this — the ImportContent page
  // injects the currently-selected child's id into the story.
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

  // Reset everything (for testing)
  const resetAllData = () => {
    setUser(null);
    setChildrenList([]);
    setSessions([]);
    setCustomStories([]);
    localStorage.removeItem(KEYS.USER);
    localStorage.removeItem(KEYS.CHILDREN);
    localStorage.removeItem(KEYS.SESSIONS);
    localStorage.removeItem(KEYS.CUSTOM_STORIES);
    clearSubscription();
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
