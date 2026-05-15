// App.jsx — router & orchestrator
// Manages which page is shown based on auth state + navigation choices.
// When we connect real Supabase later, this file barely changes.

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Landing from './pages/Landing';
import ChildOnboarding from './pages/ChildOnboarding';
import Home from './pages/Home';
import StoryLibrary from './pages/StoryLibrary';
import Reading from './pages/Reading';
import Dashboard from './pages/Dashboard';
import ImportContent from './pages/ImportContent';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Pricing from './pages/Pricing';
import AccountSettings from './pages/AccountSettings';
import Paywall from './pages/Paywall';
import Help from './pages/Help';
import MicrophoneTest from './pages/MicrophoneTest';
import ProgressDashboard from './pages/ProgressDashboard';

// Pages that anyone can view without being signed in (legal pages + pricing + help).
const PUBLIC_PAGES = new Set(['privacy', 'terms', 'pricing', 'help', 'mic-test']);

// ============================================
// ROUTER (inside AuthProvider so it can read auth state)
// ============================================
function Router() {
  const { user, loading, getChildren } = useAuth();

  // Navigation state — which page + which entity is selected
  const [route, setRoute] = useState({ page: 'landing', childId: null, storyId: null });

  // Sync URL hash with route so refresh keeps us in place (light-weight, no router lib)
  useEffect(() => {
    // Shortcut: ?test in URL → go straight to microphone diagnostic
    // (this is what we send to users when something breaks)
    const params = new URLSearchParams(window.location.search);
    if (params.has('test')) {
      setRoute({ page: 'mic-test', childId: null, storyId: null });
      return;
    }

    const hash = window.location.hash.slice(1);
    if (hash) {
      try {
        const parsed = JSON.parse(decodeURIComponent(hash));
        if (parsed.page) setRoute(parsed);
      } catch {
        // ignore malformed hash
      }
    }
  }, []);

  useEffect(() => {
    window.location.hash = encodeURIComponent(JSON.stringify(route));
  }, [route]);

  // Navigation handler — passed to every page
  const navigate = (page, params = {}) => {
    setRoute({
      page,
      childId: params.childId !== undefined ? params.childId : route.childId,
      storyId: params.storyId !== undefined ? params.storyId : route.storyId,
      reason: params.reason !== undefined ? params.reason : null,
    });
    window.scrollTo(0, 0);
  };

  // ====== AUTH GATES ======

  // While we're checking localStorage for a saved session, show splash
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#FAF6EF' }}>
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📚</div>
          <div className="text-lg" style={{ color: '#1A2B4A' }}>טוען...</div>
        </div>
      </div>
    );
  }

  // Public pages: accessible without auth
  if (PUBLIC_PAGES.has(route.page)) {
    if (route.page === 'privacy') return <Privacy onNavigate={navigate} />;
    if (route.page === 'terms') return <Terms onNavigate={navigate} />;
    if (route.page === 'pricing') return <Pricing onNavigate={navigate} />;
    if (route.page === 'help') return <Help onNavigate={navigate} />;
    if (route.page === 'mic-test') return <MicrophoneTest onNavigate={navigate} />;
  }

  // Not signed in → always go to landing
  if (!user) {
    return <Landing onNavigate={navigate} />;
  }

  // Signed in but no children yet → force onboarding
  // Special check: skip if user is in middle of onboarding flow
  const childrenList = getChildren();
  if (childrenList.length === 0 && route.page !== 'add-child' && route.page !== 'onboarding') {
    return <ChildOnboarding onNavigate={navigate} isFirst={true} />;
  }

  // ====== PAGE ROUTING ======
  switch (route.page) {
    case 'home':
    case 'landing': // signed-in user shouldn't see landing — go home
    case 'onboarding-check': // post-login transition target
      return <Home onNavigate={navigate} />;

    case 'add-child':
    case 'onboarding':
      return <ChildOnboarding onNavigate={navigate} isFirst={childrenList.length === 0} />;

    case 'edit-child':
      return <ChildOnboarding onNavigate={navigate} editChildId={route.childId} />;

    case 'story-library':
      return <StoryLibrary onNavigate={navigate} childId={route.childId} />;

    case 'reading':
      return <Reading onNavigate={navigate} childId={route.childId} storyId={route.storyId} />;

    case 'dashboard':
      return <Dashboard onNavigate={navigate} childId={route.childId} />;

    case 'progress':
      return <ProgressDashboard onNavigate={navigate} childId={route.childId} />;

    case 'import-content':
      return <ImportContent onNavigate={navigate} childId={route.childId} />;

    case 'privacy':
      return <Privacy onNavigate={navigate} />;

    case 'terms':
      return <Terms onNavigate={navigate} />;

    case 'pricing':
      return <Pricing onNavigate={navigate} />;

    case 'account':
      return <AccountSettings onNavigate={navigate} />;

    case 'paywall':
      return <Paywall onNavigate={navigate} reason={route.reason} />;

    case 'help':
      return <Help onNavigate={navigate} />;

    default:
      return <Home onNavigate={navigate} />;
  }
}

// ============================================
// MAIN APP — wraps everything in AuthProvider
// ============================================
export default function App() {
  return (
    <AuthProvider>
      <Router />
    </AuthProvider>
  );
}
