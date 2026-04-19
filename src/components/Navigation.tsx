import React from 'react';
import { Home, Wind, Calendar, Activity, PenLine, CheckSquare, Settings } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'wellness', label: 'Wellness', icon: Wind },
  { id: 'flow', label: 'Flow', icon: Activity },
  { id: 'calendar', label: 'Family Hub', icon: Calendar },
  { id: 'journal', label: 'Journal', icon: PenLine },
  { id: 'routines', label: 'Routines', icon: CheckSquare },
];

export default function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-mist/90 backdrop-blur-md border-t border-black/5 px-4 py-3 md:relative md:w-64 md:h-screen md:border-t-0 md:border-r md:bg-transparent">
      <div className="flex md:flex-col justify-between items-center md:items-start h-full max-w-lg mx-auto md:mx-0 md:max-w-none md:pt-12 md:pb-8">
        <div className="hidden md:block px-6 mb-12">
          <h1 className="text-3xl font-serif text-lake">Stillwater</h1>
          <p className="text-xs text-stream uppercase tracking-widest mt-1">Deep Nervous System Care</p>
        </div>

        <div className="flex justify-between w-full md:flex-col md:space-y-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "relative flex flex-col md:flex-row items-center md:space-x-4 px-3 py-2 md:px-6 md:py-3 transition-colors rounded-xl",
                  isActive ? "text-lake font-bold" : "text-stone/60 hover:text-stream"
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-stream/10 rounded-xl -z-10 border border-stream/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <Icon size={24} className={isActive ? "text-stream" : ""} />
                <span className={cn("text-[10px] md:text-base mt-1 md:mt-0 font-medium")}>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="hidden md:block mt-auto px-6">
          <button className="flex items-center space-x-4 text-sage-400 hover:text-sage-600 px-3 py-2">
            <Settings size={20} />
            <span className="text-sm">Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
