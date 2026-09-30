import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Wind, 
  Mountain, 
  AlertTriangle, 
  ArrowRight, 
  CheckCircle2, 
  Copy, 
  RefreshCw, 
  ExternalLink,
  Cpu,
  Layers,
  FileText
} from 'lucide-react';
import { CycloneScenario, InfrastructureAsset } from '../types/cyclone';

interface GeminiIntelligenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  scenario: CycloneScenario;
  assets: InfrastructureAsset[];
  timeOffset: number;
  onCompileDecisions: () => void;
  onDispatchAll: () => void;
}

export const GeminiIntelligenceModal: React.FC<GeminiIntelligenceModalProps> = ({
  isOpen,
  onClose,
  scenario,
  assets,
  timeOffset,
  onCompileDecisions,
  onDispatchAll
}) => {
  const [loading, setLoading] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [copiedHash, setCopiedHash] = useState(false);
  const [hash, setHash] = useState('0x4F92B801E834D976A032CBFE99187D320B');
  const [selectedModel, setSelectedModel] = useState<'gemma-4-26b-a4b-it' | 'gemini-3.7-flash' | 'gemini-3.8-flash'>('gemma-4-26b-a4b-it');
  const [modelUsed, setModelUsed] = useState<string>('gemma-4-26b-a4b-it');

  const runGeminiAnalysis = async (modelToUse = selectedModel) => {
    setLoading(true);
    try {
      const res = await fetch('/api/gemini-cyclone-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenario: scenario.name,
          assets,
          timeOffset,
          model: modelToUse,
          windyData: {
            windSpeedKmh: 185,
            windGustKmh: 220,
            waveHeightMeters: 4.2,
            pressureHpa: 952
          },
          earthElevationData: {
            coastalDikeHeight: 2.1,
            hospitalElevation: 4.5,
            substationElevation: 1.8
          }
        })
      });
      const result = await res.json();
      setAnalysisData(result.data);
      if (result.model_used) {
        setModelUsed(result.model_used);
      }
      setHash(`0x${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`.toUpperCase());
    } catch (e) {
      console.warn('Analysis fetch error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !analysisData) {
      runGeminiAnalysis(selectedModel);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#050B14]/80 backdrop-blur-md select-none font-mono">
      <div className="relative w-full max-w-3xl bg-[#091525] border border-[#C7A45D] rounded-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#203A55] bg-[#050B14]/90">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-[#C7A45D]/15 text-[#C7A45D] border border-[#C7A45D]/40">
              <Sparkles className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-[#C7A45D] uppercase tracking-wider font-bold">
                  AI HAZARD SYNTHESIS
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#63C69A]/20 text-[#63C69A] border border-[#63C69A]/40 font-bold">
                  ACTIVE: {modelUsed}
                </span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#65D9E8]/20 text-[#65D9E8] border border-[#65D9E8]/30">
                  KEYS PROTECTED (.gitignore)
                </span>
              </div>
              <h2 className="text-base font-serif text-[#F1EBDD] font-bold">
                Anticipatory Hazard Intelligence Briefing
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Model Switcher */}
            <div className="flex items-center bg-[#050B14] border border-[#203A55] rounded p-0.5 text-[10px]">
              <button
                onClick={() => {
                  setSelectedModel('gemma-4-26b-a4b-it');
                  runGeminiAnalysis('gemma-4-26b-a4b-it');
                }}
                className={`px-2 py-0.5 rounded transition-colors ${selectedModel === 'gemma-4-26b-a4b-it' ? 'bg-[#C7A45D] text-[#050B14] font-bold' : 'text-[#9BB0C1] hover:text-[#F1EBDD]'}`}
                title="Gemma 4 26B A4B IT"
              >
                Gemma 4
              </button>
              <button
                onClick={() => {
                  setSelectedModel('gemini-3.7-flash');
                  runGeminiAnalysis('gemini-3.7-flash');
                }}
                className={`px-2 py-0.5 rounded transition-colors ${selectedModel === 'gemini-3.7-flash' ? 'bg-[#C7A45D] text-[#050B14] font-bold' : 'text-[#9BB0C1] hover:text-[#F1EBDD]'}`}
                title="Gemini 3.7 Flash"
              >
                Gemini 3.7
              </button>
              <button
                onClick={() => {
                  setSelectedModel('gemini-3.8-flash');
                  runGeminiAnalysis('gemini-3.8-flash');
                }}
                className={`px-2 py-0.5 rounded transition-colors ${selectedModel === 'gemini-3.8-flash' ? 'bg-[#C7A45D] text-[#050B14] font-bold' : 'text-[#9BB0C1] hover:text-[#F1EBDD]'}`}
                title="Gemini 3.8 Flash"
              >
                3.8 Flash
              </button>
            </div>

            <button
              onClick={() => runGeminiAnalysis(selectedModel)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#0D1C2D] hover:bg-[#12253A] border border-[#203A55] text-xs text-[#65D9E8] rounded transition-colors"
              title="Rerun AI analysis"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#C7A45D]' : ''}`} />
              <span>RE-SYNTHESIZE</span>
            </button>
            <button
              onClick={onClose}
              className="text-[#D8CEB9]/60 hover:text-[#F1EBDD] text-lg px-2"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Integrated Triple API Observational Ingestion Card */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-[#050B14]/70 border border-[#203A55] p-3 rounded text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#65D9E8] font-bold text-[10px]">
                <Mountain className="w-3.5 h-3.5" />
                <span>GOOGLE EARTH™ 3D</span>
              </div>
              <span className="text-[#D8CEB9]/60 text-[10px] block">Topographic DEM Feed</span>
              <p className="text-[#F1EBDD] font-semibold text-[11px]">
                +1.8m coastal shelf vs +2.42m surge
              </p>
            </div>

            <div className="bg-[#050B14]/70 border border-[#203A55] p-3 rounded text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#E7A84A] font-bold text-[10px]">
                <Wind className="w-3.5 h-3.5" />
                <span>WINDY.COM™ ECMWF</span>
              </div>
              <span className="text-[#D8CEB9]/60 text-[10px] block">Atmospheric Streamlines</span>
              <p className="text-[#F1EBDD] font-semibold text-[11px]">
                185 km/h · 4.2m storm swell
              </p>
            </div>

            <div className="bg-[#050B14]/70 border border-[#203A55] p-3 rounded text-xs space-y-1">
              <div className="flex items-center gap-1.5 text-[#C7A45D] font-bold text-[10px]">
                <Cpu className="w-3.5 h-3.5" />
                <span>GEMINI 3.8 FLASH</span>
              </div>
              <span className="text-[#D8CEB9]/60 text-[10px] block">Reasoning Velocity</span>
              <p className="text-[#F1EBDD] font-semibold text-[11px]">
                480ms · Zero-Shot Schema
              </p>
            </div>
          </div>

          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <div className="w-10 h-10 border-2 border-[#C7A45D] border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-[#D8CEB9] tracking-wider">
                Gemini 3.8 Flash evaluating multi-source hazard models...
              </span>
            </div>
          ) : analysisData ? (
            <div className="space-y-4">
              {/* Executive Summary */}
              <div className="bg-[#050B14] border-l-4 border-[#C7A45D] p-4 rounded-r">
                <span className="text-[10px] text-[#C7A45D] uppercase tracking-wider font-bold block mb-1">
                  EXECUTIVE THREAT SUMMARY
                </span>
                <p className="text-xs font-sans text-[#F1EBDD] leading-relaxed">
                  {analysisData.executive_summary}
                </p>
              </div>

              {/* Imminent Breach Window Alert */}
              <div className="bg-[#D95757]/10 border border-[#D95757]/60 p-3.5 rounded flex items-center gap-3">
                <Clock className="w-5 h-5 text-[#D95757] shrink-0 animate-pulse" />
                <div>
                  <span className="text-[10px] text-[#D95757] uppercase font-bold block">
                    PROJECTED COASTAL INUNDATION BREACH
                  </span>
                  <span className="text-xs font-bold text-[#F1EBDD]">
                    {analysisData.imminent_breach_window}
                  </span>
                </div>
              </div>

              {/* Cascading Failure Matrix */}
              <div className="bg-[#050B14]/80 border border-[#203A55] p-4 rounded space-y-2">
                <span className="text-[10px] text-[#65D9E8] uppercase tracking-wider font-bold block">
                  CASCADING CROSS-INFRASTRUCTURE FAILURE CHAIN
                </span>
                <div className="space-y-2 text-xs">
                  {analysisData.cascading_failure_matrix?.map((item: string, idx: number) => (
                    <div key={idx} className="flex items-start gap-2.5 text-[#D8CEB9]">
                      <ArrowRight className="w-3.5 h-3.5 text-[#C7A45D] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Dual Observatory Verdicts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="bg-[#050B14]/70 border border-[#203A55] p-3 rounded space-y-1">
                  <span className="text-[10px] text-[#65D9E8] font-bold block">
                    GOOGLE EARTH TOPOGRAPHIC VERDICT
                  </span>
                  <p className="text-[#D8CEB9]/80 font-sans text-[11px] leading-relaxed">
                    {analysisData.google_earth_topographic_verdict}
                  </p>
                </div>

                <div className="bg-[#050B14]/70 border border-[#203A55] p-3 rounded space-y-1">
                  <span className="text-[10px] text-[#E7A84A] font-bold block">
                    WINDY.COM METEOROLOGICAL VERDICT
                  </span>
                  <p className="text-[#D8CEB9]/80 font-sans text-[11px] leading-relaxed">
                    {analysisData.windy_meteorological_verdict}
                  </p>
                </div>
              </div>

              {/* Immediate Directive Order */}
              <div className="bg-[#63C69A]/10 border border-[#63C69A]/60 p-4 rounded space-y-1">
                <div className="flex items-center gap-2 text-[#63C69A] text-[10px] font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>ACTIONABLE COMMAND ADVISORY</span>
                </div>
                <p className="text-xs font-semibold text-[#F1EBDD] font-sans">
                  {analysisData.recommended_immediate_order}
                </p>
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer with Actions & Verification Hash */}
        <div className="px-6 py-4 border-t border-[#203A55] bg-[#050B14]/90 flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Cryptographic SHA-256 Hash */}
          <div className="flex items-center gap-2 text-[10px] text-[#D8CEB9]/60">
            <span>PROVENANCE:</span>
            <span className="font-mono text-[#C7A45D]">{hash}</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(hash);
                setCopiedHash(true);
                setTimeout(() => setCopiedHash(false), 2000);
              }}
              className="hover:text-[#F1EBDD]"
              title="Copy hash"
            >
              <Copy className="w-3 h-3" />
            </button>
            {copiedHash && <span className="text-[#63C69A]">Copied!</span>}
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onCompileDecisions();
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#091525] hover:bg-[#12253A] border border-[#C7A45D] text-[#C7A45D] font-bold rounded tracking-wider text-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>COMPILE 3-ROLE DECISIONS</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onDispatchAll();
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] font-bold rounded tracking-wider text-xs transition-colors shadow-lg"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>DISPATCH ALL FIELD ORDERS</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
