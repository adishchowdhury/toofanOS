import React from 'react';
import { Play, ArrowRight, Check, X, Award, Sparkles, ShieldCheck, Mic } from 'lucide-react';

interface JudgeTourOverlayProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}

export const JudgeTourOverlay: React.FC<JudgeTourOverlayProps> = ({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onExit
}) => {
  const steps = [
    {
      title: '01 · Real Historical Scenario Ingestion',
      subtitle: 'Super Cyclone Amphan (Bay of Bengal)',
      body: 'CycloneOS ingests SRTM 30m Digital Elevation Models via GEE, IMD historical track cones, and OpenStreetMap coastal infrastructure graphs.'
    },
    {
      title: '02 · Physical Simulation: Surge Inundation & Runoff',
      subtitle: 'Bathtub Coastal Flood-Fill + Topographic Runoff',
      body: 'Surge inundation of 2.42m is mapped over low-lying coastal terrain, identifying immediate breach zones along the Digha and Mandarmani seawall reach.'
    },
    {
      title: '03 · Deterministic Exposure & Criticality Scoring',
      subtitle: 'District Hospital A, Substation B & Ward 4 Shelter',
      body: 'Every asset is deterministically scored (hazard intensity × societal weight). District Hospital A faces access road cut-off at T-04:12.'
    },
    {
      title: '04 · Decision Compiler: Gemini 3.8 Flash Reasoning',
      subtitle: '1 Forecast → 3 Differentiated Operational Realities',
      body: 'Gemini synthesizes structured risk JSON into role-specific time-bound directives for Municipal Command (Evacuate), Hospital Operations (Transfer), and Grid Operations (Protect Power).'
    },
    {
      title: '05 · Cloud Speech-to-Text & Dispatch Automation',
      subtitle: 'Spoken Directives & Field Incident Gateway',
      body: 'Operators can speak "Compile" or "Dispatch" directly through the Cloud Speech-to-Text mic in the CommandBar, broadcasting orders to simulated DEOC endpoints.'
    },
    {
      title: '06 · Parametric Insurance Trigger & Rapid Liquidity',
      subtitle: '$12,500,000 Instant Payout Certificate',
      body: 'Objective surge breach (+2.42m vs 2.00m policy threshold) auto-generates a verifiable cryptographic certificate without manual claims delays.'
    },
    {
      title: '07 · The Verdict: From Forecast to Action',
      subtitle: 'Closing the Last-Mile Action Gap',
      body: '"We didn\'t just predict the cyclone — we compiled the forecast into decisions someone could act on in the six hours that matter most."'
    }
  ];

  const step = steps[currentStep] || steps[0];

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 max-w-2xl w-[92%] bg-[#091525]/95 backdrop-blur-md border border-[#C7A45D] p-5 rounded-sm shadow-[0_20px_50px_rgba(0,0,0,0.8)] font-mono select-none">
      <div className="flex items-center justify-between border-b border-[#12253A] pb-2.5 mb-2.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#C7A45D] px-2 py-0.5 bg-[#C7A45D]/15 border border-[#C7A45D]/40 rounded-xs uppercase">
            JUDGE WALKTHROUGH TOUR
          </span>
          <span className="text-xs text-[#E2C98A] font-bold">
            STEP {currentStep + 1} OF {totalSteps}
          </span>
        </div>

        <button
          onClick={onExit}
          className="text-[#6F8296] hover:text-[#F1EBDD] text-xs flex items-center gap-1"
        >
          <span>EXIT TOUR</span>
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="space-y-1 mb-3.5">
        <div className="text-base font-bold text-[#F1EBDD]">{step.title}</div>
        <div className="text-xs text-[#65D9E8] font-semibold">{step.subtitle}</div>
        <p className="text-xs text-[#9BB0C1] leading-relaxed pt-1 font-mono">
          {step.body}
        </p>
      </div>

      <div className="flex items-center justify-between pt-2.5 border-t border-[#12253A]">
        <button
          onClick={onPrev}
          disabled={currentStep === 0}
          className="px-3 py-1 rounded-xs bg-[#050B14] text-[#9BB0C1] hover:text-[#F1EBDD] text-xs border border-[#12253A] disabled:opacity-40"
        >
          PREVIOUS
        </button>

        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === currentStep ? 'bg-[#C7A45D] scale-125' : i < currentStep ? 'bg-[#63C69A]' : 'bg-[#12253A]'
              }`}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          className="px-4 py-1.5 rounded-xs bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:scale-[1.02]"
        >
          <span>{currentStep === totalSteps - 1 ? 'COMPLETE TOUR' : 'NEXT STEP'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
