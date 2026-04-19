import React from 'react';
import { motion } from 'motion/react';
import { LogIn, Waves } from 'lucide-react';
import { useAuth } from '../AuthContext';

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-mist p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-12 rounded-[56px] max-w-md w-full text-center space-y-8 border border-white/20 shadow-2xl"
      >
        <div className="w-24 h-24 bg-lake rounded-full flex items-center justify-center mx-auto shadow-lg relative overflow-hidden group">
          <Waves size={48} className="text-white relative z-10" />
          <motion.div 
             animate={{ y: [20, -20, 20], rotate: [0, 10, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             className="absolute bottom-0 w-32 h-32 bg-stream/30 blur-xl"
          />
        </div>
        
        <div>
          <h1 className="text-4xl font-serif text-lake mb-2">Stillwater</h1>
          <p className="text-stone/60">Find your center. Rebuild your rhythm.</p>
        </div>

        <p className="text-sm text-stone/50 italic px-4">
          "The water is always there, waiting for you to return to its steady depths."
        </p>

        <button
          onClick={login}
          className="w-full bg-lake text-white py-5 rounded-full font-bold uppercase tracking-widest flex items-center justify-center space-x-3 hover:bg-ocean transition-all shadow-lg shadow-lake/20 group"
        >
          <LogIn size={20} className="group-hover:translate-x-1 transition-transform" />
          <span>Begin Journey with Google</span>
        </button>

        <div className="pt-4">
           <p className="text-[10px] text-stone/30 uppercase tracking-[0.2em] font-medium leading-relaxed">
             Secure Trauma-Informed Space <br /> 
             Your data is private and encrypted.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
