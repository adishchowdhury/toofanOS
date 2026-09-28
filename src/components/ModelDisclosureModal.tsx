import React from 'react';
import { ShieldCheck, Info, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';

interface ModelDisclosureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ModelDisclosureModal: React.FC<ModelDisclosureModalProps> = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#050B14]/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono select-none">
      <div className="bg-[#091525] border border-[#C7A45D] p-6 max-w-xl w-full rounded-sm shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-[#12253A] pb-3">
          <div className="flex items-center gap-2">
            <Info className="w-5 h-5 text-[#C7A45D]" />
            <h2 className="text-sm font-bold text-[#F1EBDD] tracking-wide">
              Scientific Model Approximations & Governance Disclosure
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="text-[#6F8296] hover:text-[#F1EBDD] text-sm"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3 text-xs text-[#9BB0C1] leading-relaxed">
          <div className="p-3 bg-[#050B14] rounded-xs border border-[#12253A] space-y-1 shadow-inner">
            <div className="text-[10px] text-[#E2C98A] font-bold uppercase tracking-wider">
              1. STORM SURGE INUNDATION MODEL (PRD FR-4 / NFR-2)
            </div>
            <p>
              Storm surge extent is generated using a simplified <strong>bathtub inundation approximation</strong> with coastal connectivity flood-fill from Google Earth Engine SRTM 30m Digital Elevation Models (DEM). It is engineered for rapid tactical decision compilation (&lt;30s latency) and is <em>not</em> a physics-grade hydrodynamic numerical simulation (e.g. SLOSH / ADCIRC).
            </p>
          </div>

          <div className="p-3 bg-[#050B14] rounded-xs border border-[#12253A] space-y-1 shadow-inner">
            <div className="text-[10px] text-[#5A8CFF] font-bold uppercase tracking-wider">
              2. RAINFALL-RUNOFF PROXY (PRD FR-5)
            </div>
            <p>
              Rainfall-runoff damage corridors are derived from a <strong>topographic heuristic proxy</strong> combining DEM slope calculations and open drainage line density, rather than distributed hydrological hydraulic routing.
            </p>
          </div>

          <div className="p-3 bg-[#050B14] rounded-xs border border-[#12253A] space-y-1 shadow-inner">
            <div className="text-[10px] text-[#63C69A] font-bold uppercase tracking-wider">
              3. GEMINI 3.8 DECISION REASONING CONTRACT (PRD FR-7)
            </div>
            <p>
              Gemini 3.8 Flash is strictly bounded to the role of <strong>Decision Compiler</strong>: prioritizing, synthesizing deadlines, phrasing role directives, and mapping asset dependencies. Gemini is <em>never</em> the source of fabricated numerical risk scores; all exposure metrics flow deterministically from the spatial graph.
            </p>
          </div>

          <div className="p-3 bg-[#050B14] rounded-xs border border-[#12253A] space-y-1 shadow-inner">
            <div className="text-[10px] text-[#65D9E8] font-bold uppercase tracking-wider">
              4. CLOUD SPEECH-TO-TEXT VOICE INTENT (HACKATHON REQUIREMENT)
            </div>
            <p>
              Voice commands ("Compile", "Dispatch", "Parametric") are captured via the microphone interface, processed through the Cloud Speech-to-Text streaming endpoint, and mapped directly to authenticated operational triggers.
            </p>
          </div>
        </div>

        <div className="pt-2 border-t border-[#12253A] flex items-center justify-between">
          <span className="text-[10px] text-[#6F8296]">
            Strict adherence to Track 5 Hackathon Guidelines
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xs bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] font-bold text-xs shadow-md"
          >
            ACKNOWLEDGE & RETURN
          </button>
        </div>
      </div>
    </div>
  );
};
