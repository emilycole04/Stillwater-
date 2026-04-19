/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Waves } from 'lucide-react';
import Navigation from './components/Navigation';
import DashboardSection from './components/DashboardSection';
import WellnessSection from './components/WellnessSection';
import CalendarSection from './components/CalendarSection';
import JournalSection from './components/JournalSection';
import RoutineSection from './components/RoutineSection';
import MoodTracker from './components/MoodTracker';
import Login from './components/Login';
import { AuthProvider, useAuth } from './AuthContext';
import { motion, AnimatePresence } from 'motion/react';

function SplashScreen() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-mist overflow-hidden"
    >
      <div className="atmosphere opacity-100" />
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 text-center space-y-8"
      >
        <div className="w-32 h-32 bg-lake rounded-full flex items-center justify-center mx-auto shadow-2xl relative overflow-hidden group">
          <Waves size={64} className="text-white relative z-10" />
          <motion.div
             animate={{ y: [40, -40, 40], rotate: [0, 5, 0] }}
             transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
             className="absolute bottom-0 w-40 h-40 bg-stream/30 blur-2xl"
          />
        </div>
        <div className="space-y-3">
          <h1 className="text-5xl font-serif text-lake tracking-wider">Stillwater</h1>
          <p className="text-stone/40 font-serif italic text-lg tracking-widest">Finding the steady depths within.</p>
        </div>
        <motion.div
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="pt-12 text-[10px] uppercase tracking-[0.4em] font-medium text-lake/30"
        >
          Gathering the tide
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState('home');
  const [showSplash, setShowSplash] = useState(true);
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardSection onNavigate={setActiveTab} />;
      case 'wellness':
        return <WellnessSection />;
      case 'flow':
        return <MoodTracker />;
      case 'calendar':
        return <CalendarSection />;
      case 'journal':
        return <JournalSection />;
      case 'routines':
        return <RoutineSection />;
      default:
        return <DashboardSection onNavigate={setActiveTab} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-mist">
        <div className="w-12 h-12 border-4 border-stream border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen key="splash" />}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row min-h-screen font-sans selection:bg-rose-100 overflow-hidden">
      {/* Immersive background layers */}
      <div className="atmosphere" />
      <div className="fixed inset-0 pointer-events-none -z-20 bg-sage-50" />

      {/* Navigation */}
      <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-grow h-screen overflow-y-auto scroll-smooth">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full"
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Top Header Snippet (Optional/Clean) */}
      <div className="md:hidden fixed top-0 left-0 right-0 p-4 bg-mist/90 backdrop-blur-sm z-40 border-b border-black/5">
        <div className="flex justify-between items-center px-2">
          <h1 className="text-xl font-serif text-lake">Stillwater</h1>
          <div className="space-x-4 flex items-center">
             <button onClick={logout} className="w-8 h-8 rounded-full bg-stream/20 border-2 border-white shadow-sm overflow-hidden group">
                <img src={user.photoURL || "https://picsum.photos/seed/spirit/100/100"} alt="Profile" referrerPolicy="no-referrer" />
             </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
