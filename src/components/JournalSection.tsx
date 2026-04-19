import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, History, Quote } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { Mood, JournalEntry } from '../types';
import { MOODS } from '../constants';
import { cn } from '../lib/utils';
import { journalService } from '../services/dataService';
import { useAuth } from '../AuthContext';

export default function JournalSection() {
  const { user } = useAuth();
  const [mood, setMood] = useState<Mood | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      loadEntries();
    }
  }, [user]);

  const loadEntries = async () => {
    const data = await journalService.getEntries();
    setEntries(data as any);
  };

  const generatePrompt = async (selectedMood: Mood) => {
    setIsGenerating(true);
    setMood(selectedMood);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const result = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a trauma-informed wellness coach. The user is a woman over 40 who feels "${selectedMood}". Provide a gentle, supportive journaling prompt (1-3 sentences) that encourages self-compassion and somatic awareness. Do not mention "clinician" or "therapy". Focus on the present moment and the body. Output ONLY the prompt text.`,
      });
      const text = result.text;
      setPrompt(text || "Focus on where you feel your breath right now. How can you be 10% gentler with yourself?");
    } catch (error) {
       console.error(error);
       setPrompt("Where in your body do you feel most safe or neutral right now?");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!content.trim() || isSaving) return;
    setIsSaving(true);
    try {
      await journalService.saveEntry(mood!, content, prompt);
      await loadEntries();
      setContent('');
      setMood(null);
      setPrompt('');
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 md:p-12 mb-24 md:mb-0 max-w-4xl mx-auto h-full flex flex-col">
      <header className="mb-12 flex justify-between items-end">
        <div>
          <h2 className="text-4xl text-lake font-serif">Deep Reflections</h2>
          <p className="text-stone/60 mt-2 italic">Honoring the silence between the waves.</p>
        </div>
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="p-3 rounded-full hover:bg-mist transition-colors border border-stream/10 text-stone/40 hover:text-lake"
          title="History"
        >
          <History size={24} />
        </button>
      </header>

      {showHistory ? (
        <div className="flex-grow overflow-y-auto space-y-6 pb-12">
          {entries.length === 0 ? (
            <div className="text-center py-24 glass rounded-3xl border-stream/5">
              <p className="text-stone/40 font-serif italic text-xl">Your current of thoughts will begin here.</p>
            </div>
          ) : (
            entries.map(entry => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={entry.id}
                className="glass p-8 rounded-[32px] border-l-8 border-stream/20"
                style={{ borderColor: MOODS.find(m => m.type === entry.mood)?.color.split(' ').at(-1)?.replace('border-', '') }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{MOODS.find(m => m.type === entry.mood)?.emoji}</span>
                    <span className="text-xs font-bold text-stone/40 uppercase tracking-widest">
                       {new Date(entry.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {entry.prompt && (
                  <p className="text-sm font-medium text-lake italic mb-4 bg-mist/50 p-3 rounded-xl border border-stream/10">"{entry.prompt}"</p>
                )}
                <p className="text-stone leading-relaxed whitespace-pre-wrap">{entry.content}</p>
              </motion.div>
            ))
          )}
          <button
            onClick={() => setShowHistory(false)}
            className="w-full py-4 text-sage-500 hover:text-sage-700 font-medium"
          >
            Go back to writing
          </button>
        </div>
      ) : (
        <div className="flex-grow flex flex-col space-y-8">
          {/* Mood Selector */}
          {!mood ? (
             <div className="space-y-8">
               <h3 className="text-2xl text-center text-lake italic font-serif">How is your water moving today?</h3>
               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                 {MOODS.map(m => (
                   <button
                     key={m.type}
                     onClick={() => generatePrompt(m.type)}
                     className={cn(
                       "flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all hover:shadow-lg active:scale-95",
                       m.color
                     )}
                   >
                     <span className="text-4xl mb-3">{m.emoji}</span>
                     <span className="font-bold text-sm uppercase tracking-wider">{m.label}</span>
                   </button>
                 ))}
               </div>
             </div>
          ) : (
             <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-grow flex flex-col"
            >
              <div className="glass card-mist p-8 rounded-[32px] mb-8 relative">
                {isGenerating ? (
                  <div className="flex items-center space-x-3 text-stone/40 animate-pulse">
                    <Sparkles size={20} className="animate-spin-slow" />
                    <span className="italic">Listening to the tides...</span>
                  </div>
                ) : (
                  <div className="relative">
                    <Quote className="absolute -top-4 -left-4 text-stream/10" size={48} />
                    <p className="text-lg md:text-xl text-lake font-serif leading-relaxed italic relative z-10 px-4">
                      {prompt}
                    </p>
                    <button
                      onClick={() => generatePrompt(mood)}
                      className="mt-4 text-xs font-bold text-stone/40 hover:text-lake uppercase tracking-widest"
                    >
                      New Prompt
                    </button>
                  </div>
                )}
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Let the ink flow..."
                className="flex-grow bg-transparent border-none focus:ring-0 text-xl text-stone placeholder:text-stone/30 placeholder:font-serif placeholder:italic leading-relaxed resize-none p-4"
              />

              <div className="mt-8 flex justify-between items-center py-4 border-t border-stream/10">
                <button
                  onClick={() => { setMood(null); setContent(''); }}
                  className="text-stone/40 hover:text-lake font-bold uppercase tracking-widest text-xs"
                >
                  Clear Entry
                </button>
                <div className="flex items-center space-x-4">
                  <span className="text-stone/30 text-xs font-medium">{content.length} characters</span>
                  <button
                    onClick={handleSave}
                    disabled={!content.trim() || isGenerating}
                    className="bg-lake text-white px-8 py-3 rounded-full flex items-center space-x-2 hover:bg-ocean disabled:opacity-50 transition-all shadow-lg shadow-ocean/10"
                  >
                    <span className="font-semibold">Store Entry</span>
                    <Send size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
