import React, { useState } from 'react';
import { 
  Play, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Compass, 
  Radio, 
  Activity, 
  Zap, 
  Building2, 
  Home, 
  Award,
  Layers,
  Wind
} from 'lucide-react';
import { CycloneScenario } from '../types/cyclone';

interface CinematicLandingProps {
  scenario: CycloneScenario;
  onEnterCommand: () => void;
  onLaunchDemoWalkthrough: () => void;
  onSelectReplayScenario: (scenarioId: string) => void;
}

export const CinematicLanding: React.FC<CinematicLandingProps> = ({
  scenario,
  onEnterCommand,
  onLaunchDemoWalkthrough,
  onSelectReplayScenario
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    setMousePos({
      x: (clientX / window.innerWidth - 0.5) * 20,
      y: (clientY / window.innerHeight - 0.5) * 20
    });
  };

  return (
    <div 
      className="min-h-screen bg-[#050B14] text-[#F1EBDD] relative overflow-hidden select-none flex flex-col justify-between"
      onMouseMove={handleMouseMove}
    >
      {/* Background Cartographic Subtle Grid & Ambient Radial Lighting */}
      <div className="absolute inset-0 carto-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 film-grain opacity-20 pointer-events-none" />
      <div 
        className="absolute top-1/4 right-1/4 w-[650px] h-[650px] bg-[#65D9E8]/8 rounded-full blur-[150px] pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }}
      />
      <div 
        className="absolute bottom-1/4 left-1/4 w-[550px] h-[550px] bg-[#C7A45D]/8 rounded-full blur-[140px] pointer-events-none transition-transform duration-700 ease-out"
        style={{ transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)` }}
      />

      {/* Top Intelligence Dossier Header */}
      <header className="px-6 lg:px-12 py-6 border-b border-[#12253A]/80 flex items-center justify-between z-10 bg-[#050B14]/80 backdrop-blur-md">
        <div className="flex items-center gap-3.5">
          <div className="relative w-9 h-9 rounded-full border border-[#C7A45D]/70 flex items-center justify-center bg-[#091525] shadow-[0_0_20px_rgba(199,164,93,0.25)]">
            <div className="w-6 h-6 rounded-full border border-dashed border-[#65D9E8]/80 animate-[spin_12s_linear_infinite]" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#E2C98A] shadow-[0_0_10px_#E2C98A]" />
          </div>
          <div>
            <span className="font-cinzel text-base font-bold tracking-[0.26em] text-[#F1EBDD]">
              CYCLONEOS
            </span>
            <span className="text-[10px] font-mono tracking-widest text-[#6F8296] block uppercase">
              Anticipatory Action Compiler
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onLaunchDemoWalkthrough}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-sm bg-[#C7A45D]/15 hover:bg-[#C7A45D]/25 text-[#E2C98A] border border-[#C7A45D]/50 font-mono text-xs tracking-wider transition-all shadow-[0_0_12px_rgba(199,164,93,0.15)]"
          >
            <Play className="w-3.5 h-3.5 fill-[#E2C98A]" />
            <span>2-MIN TOUR</span>
          </button>

          <button
            onClick={onEnterCommand}
            className="flex items-center gap-2 px-5 py-2 rounded-sm bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] font-mono text-xs font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(199,164,93,0.3)] hover:scale-[1.02]"
          >
            <span>ENTER COMMAND CENTER</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Hero Visual Field */}
      <main className="px-6 lg:px-12 py-10 lg:py-16 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 flex-1">
        {/* Left Column: Dossier Hero Statements */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-xs bg-[#091525] border border-[#C7A45D]/50 text-[#E2C98A] text-xs font-mono tracking-widest uppercase shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#65D9E8] animate-ping" />
            <span>BAY OF BENGAL · HISTORICAL INTELLIGENCE REPLAY</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-bold text-[#F1EBDD] tracking-tight leading-[1.04]">
              FROM FORECAST <br />
              <span className="text-[#C7A45D]">TO ACTION.</span> <br />
              <span className="italic font-normal font-serif text-[#E2C98A]">BEFORE IMPACT.</span>
            </h1>

            <p className="font-script text-2xl text-[#E2C98A] pt-1">
              "before the water arrives, turn intelligence into movement."
            </p>
          </div>

          <p className="text-base text-[#9BB0C1] font-mono leading-relaxed max-w-xl">
            CycloneOS converts geospatial hazard intelligence into prioritized, time-bound decisions for the people responsible for protecting communities and infrastructure.
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onEnterCommand}
              className="px-6 py-3.5 rounded-sm bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] font-mono text-sm font-bold tracking-wider flex items-center gap-2.5 transition-all shadow-[0_0_25px_rgba(199,164,93,0.35)] hover:scale-[1.02]"
            >
              <span>ENTER COMMAND CENTER</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onLaunchDemoWalkthrough}
              className="px-5 py-3.5 rounded-sm bg-[#091525] hover:bg-[#12253A] text-[#F1EBDD] border border-[#12253A] hover:border-[#65D9E8] font-mono text-xs tracking-wider flex items-center gap-2 transition-all shadow-md"
            >
              <Play className="w-3.5 h-3.5 text-[#65D9E8] fill-[#65D9E8]" />
              <span>LAUNCH 2-MIN WALKTHROUGH</span>
            </button>
          </div>

          {/* Core Roles Indicator */}
          <div className="pt-6 border-t border-[#12253A] grid grid-cols-3 gap-3.5 text-xs font-mono">
            <div className="p-3 bg-[#091525]/80 border border-[#12253A] rounded-xs shadow-inner">
              <div className="text-[#65D9E8] font-bold text-[11px] mb-0.5 font-cinzel">01 · MUNICIPAL</div>
              <div className="text-[10px] text-[#6F8296]">Ward Evacuation & Staging</div>
            </div>
            <div className="p-3 bg-[#091525]/80 border border-[#12253A] rounded-xs shadow-inner">
              <div className="text-[#D95757] font-bold text-[11px] mb-0.5 font-cinzel">02 · HOSPITAL</div>
              <div className="text-[10px] text-[#6F8296]">Corridor & Patient Care</div>
            </div>
            <div className="p-3 bg-[#091525]/80 border border-[#12253A] rounded-xs shadow-inner">
              <div className="text-[#E2C98A] font-bold text-[11px] mb-0.5 font-cinzel">03 · GRID</div>
              <div className="text-[10px] text-[#6F8296]">Substation De-Energize</div>
            </div>
          </div>
        </div>

        {/* Right Column: Cinematic Map Card */}
        <div className="lg:col-span-5 relative">
          <div className="bg-[#091525] border border-[#C7A45D]/50 rounded-sm p-4.5 shadow-2xl relative overflow-hidden font-mono">
            {/* Corner Coordinates */}
            <div className="flex items-center justify-between text-[10px] text-[#6F8296] border-b border-[#12253A] pb-2 mb-3">
              <span>21°37′N · 87°30′E</span>
              <span className="text-[#E7A84A] font-bold">CYCLONE AMPHAN REPLAY</span>
            </div>

            {/* Stylized Miniature Bay of Bengal SVG */}
            <div className="relative h-68 w-full bg-[#050B14] rounded-xs overflow-hidden border border-[#12253A]">
              <svg viewBox="0 0 400 300" className="w-full h-full">
                {/* Ocean background */}
                <rect width="400" height="300" fill="#091525" />

                {/* Coastline */}
                <path
                  d="M -20 -20 L 420 -20 L 420 180 Q 320 160 250 170 Q 180 180 140 140 Q 80 110 -20 120 Z"
                  fill="#050B14"
                  stroke="#12253A"
                  strokeWidth="1.5"
                />

                {/* Surge Hazard Fill */}
                <path
                  d="M -20 120 Q 80 110 140 140 Q 180 180 250 170 Q 320 160 420 180 L 420 140 Q 280 120 180 120 Q 80 90 -20 100 Z"
                  fill="#65D9E8"
                  fillOpacity="0.35"
                />

                {/* Track Line */}
                <path
                  d="M 60 280 Q 120 220 180 170 T 260 110"
                  stroke="#E7A84A"
                  strokeWidth="2.2"
                  strokeDasharray="5,3"
                  fill="none"
                />

                {/* Storm Eye */}
                <circle cx="180" cy="170" r="20" fill="none" stroke="#65D9E8" strokeWidth="1" strokeDasharray="3,3" />
                <circle cx="180" cy="170" r="7" fill="#D95757" />
                <circle cx="180" cy="170" r="3" fill="#F1EBDD" />

                {/* Infrastructure points */}
                <circle cx="170" cy="120" r="4.5" fill="#D95757" />
                <circle cx="195" cy="110" r="4.5" fill="#E2C98A" />
                <circle cx="150" cy="130" r="4.5" fill="#65D9E8" />
              </svg>

              <div className="absolute bottom-2.5 left-2.5 text-[9px] text-[#6F8296] bg-[#050B14]/85 px-2 py-0.5 rounded-xs border border-[#12253A]">
                SIMULATED SURGE: +2.42m
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3.5 pt-2 border-t border-[#12253A]">
              <div>
                <span className="text-[9px] text-[#6F8296] block">PEAK WIND</span>
                <span className="text-[#E7A84A] font-bold">260 km/h</span>
              </div>
              <div>
                <span className="text-[9px] text-[#6F8296] block">TIME TO IMPACT</span>
                <span className="text-[#F1EBDD] font-bold">06:00 HRS</span>
              </div>
              <div>
                <span className="text-[9px] text-[#6F8296] block">EXPOSED ASSETS</span>
                <span className="text-[#D95757] font-bold">8 CRITICAL</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Trust Strip Footer */}
      <footer className="px-6 lg:px-12 py-5 border-t border-[#12253A]/80 bg-[#091525]/50 z-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-mono text-[#6F8296]">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-[#E2C98A] font-bold">FOUNDATIONAL DATA:</span>
            <span>GOOGLE EARTH ENGINE (SRTM DEM)</span>
            <span>·</span>
            <span>GEMINI 3.8 FLASH</span>
            <span>·</span>
            <span>GOOGLE CLOUD SPEECH-TO-TEXT</span>
            <span>·</span>
            <span>OPENSTREETMAP</span>
          </div>

          <div className="text-[#6F8296]">
            CYCLONEOS · ANTICIPATORY ACTION COMPILER
          </div>
        </div>
      </footer>
    </div>
  );
};
