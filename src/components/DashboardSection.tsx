import React from 'react';
import { motion } from 'motion/react';
import { Wind, Heart, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';

export default function DashboardSection({ onNavigate }: { onNavigate: (tab: string) => void }) {
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Morning' : hour < 18 ? 'Afternoon' : 'Evening';

  return (
    <div className="p-6 md:p-12 mb-24 md:mb-0 max-w-6xl mx-auto overflow-y-auto">
      <header className="mb-16">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <span className="text-sm font-bold text-stream uppercase tracking-[0.3em] mb-4 block underline decoration-reef decoration-2 underline-offset-8">Welcome to Stillwater</span>
          <h2 className="text-5xl md:text-7xl text-lake leading-tight">
            Good {greeting}, <br />
            <span className="text-stream italic font-serif">Exhale slowly.</span>
          </h2>
        </motion.div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Quick Check-in Card (Flow) */}
        <div 
          onClick={() => onNavigate('flow')}
          className="md:col-span-2 glass p-10 rounded-[48px] overflow-hidden relative group cursor-pointer hover:shadow-xl hover:bg-white/90 transition-all border border-stream/10"
        >
          <div className="relative z-10">
            <h3 className="text-2xl mb-4 text-lake">Check your system's flow.</h3>
            <p className="text-stone/60 mb-8 max-w-sm">Notice the movement of your breath. Is your inner rhythm calm or turbulent?</p>

            <div className="flex flex-wrap gap-4">
              <span className="bg-reef/10 text-reef px-6 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest group-hover:bg-reef/20 transition-colors">
                Regulated
              </span>
              <span className="bg-ocean/10 text-ocean px-6 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest group-hover:bg-ocean/20 transition-colors">
                Turbulent
              </span>
              <span className="bg-stone/10 text-stone px-6 py-3 rounded-2xl font-bold uppercase text-[10px] tracking-widest group-hover:bg-stone/20 transition-colors">
                Still
              </span>
            </div>
          </div>
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute -top-12 -right-12 w-96 h-96 bg-mist rounded-full blur-3xl -z-0"
          />
        </div>

        {/* Action Button: Rooting */}
        <button
          onClick={() => onNavigate('wellness')}
          className="bg-lake text-white p-10 rounded-[48px] flex flex-col justify-between hover:bg-ocean transition-all group shadow-2xl shadow-lake/10 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10">
             <Wind size={80} />
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center relative z-10">
             <Wind size={24} />
          </div>
          <div className="relative z-10">
            <h3 className="text-2xl mb-2 text-left">Find Your Center</h3>
            <p className="text-white/60 text-sm text-left mb-6">Return to still waters with a somatic reset.</p>
            <div className="flex items-center text-stream font-bold uppercase text-[10px] tracking-widest">
               Start session <ArrowRight size={14} className="ml-2 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Family Update Snippet */}
        <div className="glass p-8 rounded-[40px] border border-stream/5">
           <div className="flex items-center justify-between mb-8">
             <h4 className="text-sm font-bold text-lake uppercase tracking-widest flex items-center">
               <ShieldCheck size={16} className="text-stream mr-2" /> Daily Hub
             </h4>
             <span className="text-ocean text-[10px] font-bold">2 Priority Items</span>
           </div>

           <div className="space-y-4">
             <div className="bg-white/40 backdrop-blur-sm p-5 rounded-3xl flex items-center space-x-4 border border-white/20">
               <div className="w-2 h-2 rounded-full bg-mom" />
               <p className="text-sm text-stone">Cleaning: Living Room (Partner)</p>
             </div>
             <div className="bg-white/40 backdrop-blur-sm p-5 rounded-3xl flex items-center space-x-4 border border-white/20">
               <div className="w-2 h-2 rounded-full bg-sarah" />
               <p className="text-sm text-stone">Family: School Meeting at 4 PM</p>
             </div>
           </div>

           <button
             onClick={() => onNavigate('calendar')}
             className="w-full mt-6 py-4 text-xs font-bold text-stone/40 hover:text-lake uppercase tracking-widest border-t border-stream/10 transition-colors"
           >
             Open full calendar
           </button>
        </div>

        {/* Affirmation Card */}
        <div className="glass p-10 rounded-[40px] flex flex-col justify-center text-center relative overflow-hidden group border border-stream/5">
          <Sparkles className="text-stream/10 absolute top-6 right-6 group-hover:rotate-12 transition-transform" size={40} />
          <h3 className="text-3xl text-lake font-serif italic mb-4 leading-relaxed">
            "I move with the current, not against it."
          </h3>
          <p className="text-stone/40 text-sm">Today's intention of flow.</p>
        </div>
      </div>
    </div>
  );
}
