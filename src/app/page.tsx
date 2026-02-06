"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import RegistrationForm from "@/components/RegistrationForm";
import Lanterns from "@/components/Lanterns";
import FloatingStars from "@/components/FloatingStars";
import RacingDecorations from "@/components/RacingDecorations";
import SplashScreen from "@/components/SplashScreen";
import { Moon } from "lucide-react";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <div className="min-h-screen bg-rama-dark-green text-white relative overflow-hidden font-sans selection:bg-rama-gold selection:text-black flex flex-col items-center">
      <AnimatePresence>
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} />
        )}
      </AnimatePresence>

      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 pattern-islamic-geometry opacity-30"></div>
        <div className="absolute inset-0 pattern-stars"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-black/20 to-transparent"></div>
        <RacingDecorations />
      </div>

      <Lanterns />
      <FloatingStars />

      <main className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-start min-h-screen pt-20">

        {/* Hero Section */}
        {/* Hero Section */}
        <div className="text-center space-y-4 mb-16 relative w-full max-w-4xl mx-auto">
          {/* Crescent Moon Icon - Cleaner */}
          <div className="flex justify-center mb-6">
            <Moon className="w-16 h-16 text-rama-gold fill-rama-gold/20" strokeWidth={1.5} />
          </div>

          {/* TECHNODAY Line */}
          <div className="flex items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="h-[1px] w-12 bg-white/30"></div>
            <h2 className="text-sm md:text-base font-sans tracking-[0.3em] font-medium text-rama-gold uppercase">Technoday</h2>
            <div className="h-[1px] w-12 bg-white/30"></div>
          </div>

          {/* Main Title Block */}
          <div className="flex flex-col items-center gap-2 py-4">
            <h1 className="text-5xl md:text-8xl font-majestic text-rama-gold font-bold tracking-wide animate-in fade-in duration-1000 delay-300 animate-holy-glow">
              RAMADHAN
            </h1>

            <h1 className="text-4xl md:text-7xl font-sans font-black tracking-[0.2em] text-white/90 animate-in slide-in-from-bottom-8 duration-1000 delay-500 drop-shadow-2xl">
              PIT STOP
            </h1>
          </div>
        </div>

        {/* Date Section */}
        <div className="text-center mb-12 animate-in fade-in duration-1000 delay-700">
          <h3 className="text-2xl md:text-3xl font-normal tracking-wide text-rama-white/90">
            FRIDAY 27TH, FEB 2026
          </h3>
        </div>

        {/* Registration Area */}
        <div className="w-full max-w-md mx-auto relative z-20 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-1000">
          <div className="text-center mb-4">
            <p className="text-rama-white/70 text-sm uppercase tracking-widest">Register Here</p>
          </div>

          {/* We wrap the form to make it blend with the poster style */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-rama-gold via-rama-gold-muted to-rama-gold opacity-30 rounded-3xl blur-md group-hover:opacity-50 transition-opacity"></div>
            <div className="relative bg-rama-dark-green/80 backdrop-blur-md p-1 rounded-3xl border border-rama-gold/30 shadow-2xl overflow-hidden">
              {/* Checkered Racing Strip */}
              <div className="absolute top-0 left-0 w-full h-3 z-10 opacity-50"
                style={{
                  backgroundImage: `linear-gradient(45deg, #000 25%, transparent 25%), 
                                          linear-gradient(-45deg, #000 25%, transparent 25%), 
                                          linear-gradient(45deg, transparent 75%, #000 75%), 
                                          linear-gradient(-45deg, transparent 75%, #000 75%)`,
                  backgroundSize: `20px 20px`,
                  backgroundPosition: `0 0, 0 10px, 10px -10px, -10px 0px`,
                  backgroundColor: '#FFC845'
                }}
              ></div>

              {/* Corner Ornaments */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-rama-gold/50 rounded-tl-3xl pointer-events-none"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-rama-gold/50 rounded-tr-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-rama-gold/50 rounded-bl-3xl pointer-events-none"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-rama-gold/50 rounded-br-3xl pointer-events-none"></div>

              <RegistrationForm />
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="mt-16 flex flex-wrap gap-4 justify-center">
          <a
            href="/shuffle"
            className="group relative px-8 py-4 bg-gradient-to-r from-rama-gold via-yellow-500 to-rama-gold rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,200,69,0.4)] hover:shadow-[0_0_40px_rgba(255,200,69,0.6)] border border-yellow-400/30 overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="absolute top-0 left-[-100%] w-[50%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 group-hover:translate-x-[400%] transition-transform duration-1000 ease-in-out"></div>

            <div className="relative flex items-center gap-3 text-rama-black">
              <span className="text-2xl group-hover:animate-bounce">💬</span>
              <span className="font-extrabold tracking-wide text-lg">Intip Harapan & Curhatan Teman-Teman</span>
            </div>
          </a>
        </div>

        {/* Footer info - Simplified */}
        <div className="mt-20 w-full max-w-2xl flex flex-col md:flex-row justify-between items-center text-sm text-rama-white/60 text-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-rama-gold font-serif italic text-lg">Location</span>
            <p>In Front Of <strong className="text-white font-sans">Encode & Decode</strong></p>
          </div>
          <div className="flex flex-col items-center md:items-end gap-1">
            <span className="text-rama-gold font-serif italic text-lg">Details</span>
            <p>16.30 - 18.15 • Bebas Sopan</p>
          </div>
        </div>

      </main>
    </div>
  );
}
