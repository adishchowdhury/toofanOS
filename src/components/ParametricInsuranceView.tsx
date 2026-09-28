import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ExternalLink, 
  CheckCircle2, 
  Copy, 
  Download, 
  Award, 
  AlertOctagon,
  FileCheck,
  Building,
  DollarSign
} from 'lucide-react';
import { ParametricTrigger } from '../types/cyclone';

interface ParametricInsuranceViewProps {
  triggerData: ParametricTrigger;
}

export const ParametricInsuranceView: React.FC<ParametricInsuranceViewProps> = ({
  triggerData
}) => {
  const [copied, setCopied] = useState(false);
  const [payoutDisbursed, setPayoutDisbursed] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard?.writeText(triggerData.verification_hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDisbursePayout = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setPayoutDisbursed(true);
    }, 1200);
  };

  return (
    <div className="flex-1 bg-[#050B14] p-4 lg:p-8 overflow-y-auto select-none space-y-6">
      {/* Section Header */}
      <div className="border-b border-[#12253A] pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-mono tracking-widest text-[#C7A45D] uppercase font-bold px-2 py-0.5 border border-[#C7A45D]/40 rounded-xs bg-[#C7A45D]/10">
            FINANCIAL RESILIENCE LAYER
          </span>
          <span className="text-[11px] font-mono text-[#63C69A]">
            ● ORACLE STREAM LIVE
          </span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#F1EBDD] tracking-tight">
          PARAMETRIC TRIGGER
        </h1>
        <p className="text-sm font-mono text-[#9BB0C1] mt-1 font-script text-base text-[#E2C98A]">
          "objective event detection · immediate liquidity"
        </p>
      </div>

      {/* Main Certificate Container (Ivory Paper Aesthetic) */}
      <div className="max-w-3xl mx-auto relative">
        {/* Certificate Card */}
        <div className="bg-[#F1EBDD] text-[#050B14] p-6 lg:p-10 rounded-sm shadow-[0_25px_60px_rgba(0,0,0,0.65)] border-4 border-[#C7A45D] relative overflow-hidden font-mono">
          {/* Faint Cartographic Watermark in Background */}
          <div className="absolute inset-0 carto-grid-dense opacity-25 pointer-events-none" />

          {/* Top Decorative Border Strip */}
          <div className="flex items-center justify-between border-b-2 border-[#091525]/20 pb-4 mb-6">
            <div>
              <div className="text-[11px] tracking-[0.28em] text-[#8D7548] font-bold uppercase font-cinzel">
                COASTAL DISASTER PARAMETRIC RESILIENCE PROTOCOL
              </div>
              <div className="text-2xl font-serif font-bold text-[#050B14] tracking-wider mt-1">
                SURGE THRESHOLD BREACH CERTIFICATE
              </div>
            </div>

            {/* Embossed Animated Gold Seal */}
            <div className="relative w-22 h-22 rounded-full border-2 border-[#C7A45D] flex items-center justify-center bg-gradient-to-br from-[#E2C98A] via-[#C7A45D] to-[#8D7548] shadow-lg shrink-0">
              <div className="w-18 h-18 rounded-full border border-dashed border-[#050B14]/40 flex flex-col items-center justify-center text-center p-1">
                <Award className="w-6 h-6 text-[#050B14] mb-0.5" />
                <span className="text-[8px] font-bold tracking-tight text-[#050B14] uppercase leading-none font-cinzel">
                  CYCLONEOS
                </span>
                <span className="text-[7px] text-[#050B14] uppercase leading-none mt-0.5 font-bold">
                  VERIFIED
                </span>
              </div>
            </div>
          </div>

          {/* Certificate Body Data Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mb-6">
            <div className="p-3.5 bg-[#D8CEB9] rounded-xs border border-[#091525]/10 space-y-1">
              <span className="text-[10px] text-[#6F8296] font-bold uppercase">TRIGGER IDENTIFIER</span>
              <div className="text-sm font-bold text-[#050B14]">{triggerData.trigger_id}</div>
              <div className="text-[10px] text-[#8D7548]">{triggerData.scenario_ref}</div>
            </div>

            <div className="p-3.5 bg-[#D8CEB9] rounded-xs border border-[#091525]/10 space-y-1">
              <span className="text-[10px] text-[#6F8296] font-bold uppercase">GEO-REFERENCED GAUGE</span>
              <div className="text-xs font-bold text-[#050B14]">{triggerData.location.name}</div>
              <div className="text-[10px] text-[#8D7548]">
                {triggerData.location.latitude.toFixed(4)}° N · {triggerData.location.longitude.toFixed(4)}° E
              </div>
            </div>

            <div className="p-3.5 bg-[#D8CEB9] rounded-xs border border-[#091525]/10 space-y-1">
              <span className="text-[10px] text-[#6F8296] font-bold uppercase">OBSERVED / SIMULATED SURGE</span>
              <div className="text-xl font-bold text-[#D95757] flex items-center gap-1.5">
                <span>{triggerData.simulated_surge_height_m} m</span>
                <span className="text-xs text-[#050B14] font-normal">(Above MSL)</span>
              </div>
              <div className="text-[10px] text-[#6F8296]">Derived from SRTM DEM + IMD Pressure heuristic</div>
            </div>

            <div className="p-3.5 bg-[#D8CEB9] rounded-xs border border-[#091525]/10 space-y-1">
              <span className="text-[10px] text-[#6F8296] font-bold uppercase">POLICY THRESHOLD</span>
              <div className="text-xl font-bold text-[#050B14] flex items-center gap-1.5">
                <span>{triggerData.policy_threshold_m.toFixed(2)} m</span>
                <span className="text-xs text-[#63C69A] font-bold">[BREACHED +0.42m]</span>
              </div>
              <div className="text-[10px] text-[#6F8296]">Contract terms: Payout initiates on &ge; 2.00m surge</div>
            </div>

            <div className="p-3.5 bg-[#D8CEB9] rounded-xs border border-[#091525]/10 space-y-1">
              <span className="text-[10px] text-[#6F8296] font-bold uppercase">TRIGGER STATUS</span>
              <div className="text-xs font-bold text-[#D95757] flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D95757] animate-ping" />
                <span>● BREACH CONFIRMED (100% OBJECTIVE)</span>
              </div>
              <div className="text-[10px] text-[#6F8296]">Zero claims adjuster delays required</div>
            </div>

            <div className="p-3.5 bg-[#D8CEB9] rounded-xs border border-[#091525]/10 space-y-1">
              <span className="text-[10px] text-[#6F8296] font-bold uppercase">LIQUIDITY DISBURSAL SUM</span>
              <div className="text-2xl font-bold text-[#C7A45D] flex items-center gap-1 font-serif">
                <span>{triggerData.parametric_payout_usd}</span>
              </div>
              <div className="text-[10px] text-[#050B14] font-semibold">{triggerData.payout_beneficiary}</div>
            </div>
          </div>

          {/* Cryptographic Proof Strip */}
          <div className="bg-[#091525] text-[#F1EBDD] p-3.5 rounded-xs flex items-center justify-between text-[11px] mb-6 shadow-inner">
            <div className="truncate mr-2">
              <span className="text-[#6F8296] text-[10px] block uppercase">CRYPTOGRAPHIC PROOF & ORACLE HASH</span>
              <span className="text-[#E2C98A] font-bold">{triggerData.verification_hash}</span>
            </div>
            <button
              onClick={handleCopyHash}
              className="px-3 py-1 rounded-xs bg-[#12253A] hover:bg-[#C7A45D] hover:text-[#050B14] text-xs transition-colors flex items-center gap-1.5 shrink-0 font-bold"
            >
              {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-[#63C69A]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'COPIED' : 'COPY'}</span>
            </button>
          </div>

          {/* Bottom Sign-Off Signatures */}
          <div className="pt-4 border-t-2 border-[#091525]/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[10px] text-[#6F8296]">
            <div>
              <div className="font-bold text-[#050B14] uppercase">GEOSPATIAL ORACLE VERIFIER</div>
              <div>Google Earth Engine & IMD Automated Marine Gauge Interface</div>
            </div>

            <div className="text-right">
              <div className="font-bold text-[#050B14] uppercase">TIMESTAMP</div>
              <div>{new Date().toLocaleString()} · IST</div>
            </div>
          </div>
        </div>

        {/* Certificate Actions Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#091525] hover:bg-[#12253A] text-[#F1EBDD] border border-[#12253A] text-xs font-mono transition-colors shadow-md"
          >
            <Download className="w-3.5 h-3.5 text-[#65D9E8]" />
            <span>EXPORT VERIFIABLE PDF / JSON</span>
          </button>

          <button
            onClick={handleDisbursePayout}
            disabled={payoutDisbursed || isVerifying}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-sm font-mono text-xs font-bold tracking-wider transition-all shadow-xl ${
              payoutDisbursed
                ? 'bg-[#63C69A]/20 text-[#63C69A] border border-[#63C69A]/40 cursor-default'
                : 'bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] shadow-[0_0_25px_rgba(199,164,93,0.35)] hover:scale-[1.01]'
            }`}
          >
            {isVerifying ? (
              <span>VERIFYING SATELLITE ORACLE...</span>
            ) : payoutDisbursed ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#63C69A]" />
                <span>$12.5M RAPID LIQUIDITY DISBURSED TO DEOC</span>
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4" />
                <span>TRIGGER IMMEDIATE ESCROW DISBURSAL</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
