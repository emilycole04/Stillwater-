import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';
import { EXERCISES } from '../constants';
import { cn } from '../lib/utils';
import { Exercise } from '../types';

export default function WellnessSection() {
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);

  return (
    <div className="p-6 md:p-12 mb-24 md:mb-0">
      <header className="mb-12">
        <h2 className="text-4xl mb-2 text-lake">Your Body is Your Sanctuary</h2>
        <p className="text-stone/60 max-w-xl italic">
          Deep dives into calm. Let the currents of stress wash away as you return to center.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {EXERCISES.map((ex) => (
          <motion.button
            key={ex.id}
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSelectedExercise(ex)}
            className="flex flex-col text-left p-8 rounded-3xl glass transition-all hover:shadow-xl group"
          >
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs uppercase tracking-widest text-stream font-bold bg-mist px-3 py-1 rounded-full border border-stream/10">
                {ex.category}
              </span>
              <span className="text-sm font-medium text-stone/50">{ex.duration}</span>
            </div>
            <h3 className="text-2xl mb-3 text-lake group-hover:text-ocean">{ex.title}</h3>
            <p className="text-stone/60 text-sm mb-6 flex-grow">{ex.description}</p>
            <div className="flex items-center text-lake font-medium text-sm group-hover:text-stream transition-colors">
              Begin Journey <ChevronRight size={16} className="ml-1" />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {selectedExercise && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedExercise(null)}
                className="absolute inset-0 bg-lake/40 backdrop-blur-sm"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-[40px] shadow-2xl overflow-hidden p-8 md:p-12 border border-white/20"
              >
                <button
                  onClick={() => setSelectedExercise(null)}
                  className="absolute top-8 right-8 text-stone/40 hover:text-lake"
                >
                  Close
                </button>

                <header className="mb-8">
                  <span className="text-xs uppercase tracking-widest text-stream mb-2 block font-bold">{selectedExercise.category}</span>
                  <h3 className="text-4xl text-lake mb-4">{selectedExercise.title}</h3>
                  <p className="text-stone/60">{selectedExercise.description}</p>
                </header>

                <div className="space-y-6">
                  {selectedExercise.steps.map((step, i) => (
                    <div key={i} className="flex space-x-6">
                      <span className="text-stream/20 font-serif text-5xl italic leading-none">{i + 1}</span>
                      <p className="text-stone pt-2 leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>

                {selectedExercise.category === 'breathwork' && (
                  <div className="mt-12 p-8 bg-mist/50 rounded-3xl flex flex-col items-center border border-stream/10">
                     <BreathingCircle />
                  </div>
                )}

                <div className="mt-12 flex justify-center">
                  <button
                    onClick={() => setSelectedExercise(null)}
                    className="bg-lake text-white px-12 py-4 rounded-full font-medium hover:bg-ocean transition-colors shadow-lg shadow-ocean/20"
                  >
                    Soul Calmed
                  </button>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function BreathingCircle() {
  const [phase, setPhase] = useState<'Inhale' | 'Hold' | 'Exhale'>('Inhale');

  // Simple animation placeholder
  return (
    <div className="flex flex-col items-center">
      <motion.div
        animate={{
          scale: phase === 'Inhale' ? 1.5 : phase === 'Hold' ? 1.5 : 1,
        }}
        transition={{
          duration: phase === 'Inhale' ? 4 : phase === 'Hold' ? 7 : 8,
          ease: "easeInOut"
        }}
        onAnimationComplete={() => {
           if (phase === 'Inhale') setPhase('Hold');
           else if (phase === 'Hold') setPhase('Exhale');
           else setPhase('Inhale');
        }}
        className="w-32 h-32 rounded-full bg-stream/10 border-4 border-stream/20 shadow-inner flex items-center justify-center"
      >
        <span className="text-lake font-bold">{phase}</span>
      </motion.div>
      <p className="mt-8 text-lake/30 text-[10px] uppercase tracking-widest font-bold">Sink into the current</p>
    </div>
  );
}
