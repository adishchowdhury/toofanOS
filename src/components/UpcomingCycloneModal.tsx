import React, { useState } from 'react';
import { 
  Compass, 
  Wind, 
  Waves, 
  AlertTriangle, 
  Sparkles, 
  Play, 
  CheckCircle2, 
  X, 
  Activity, 
  Clock, 
  MapPin, 
  Flame,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { CycloneScenario } from '../types/cyclone';

interface UpcomingCycloneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyScenario: (scenario: CycloneScenario) => void;
}

export const UpcomingCycloneModal: React.FC<UpcomingCycloneModalProps> = ({
  isOpen,
  onClose,
  onApplyScenario
}) => {
  const [basin, setBasin] = useState<string>('Bay of Bengal');
  const [sstAnomaly, setSstAnomaly] = useState<number>(2.4);
  const [leadTimeHours, setLeadTimeHours] = useState<number>(48);
  const [cycloneName, setCycloneName] = useState<string>('Upcoming Cyclone Sagar');
  const [selectedModel, setSelectedModel] = useState<string>('gemma-4-26b-a4b-it');
  
  const [isPredicting, setIsPredicting] = useState<boolean>(false);
  const [predictedScenario, setPredictedScenario] = useState<CycloneScenario | null>(null);
  const [predictionMeta, setPredictionMeta] = useState<{ mode?: string; model_used?: string } | null>(null);

  if (!isOpen) return null;

  const handleRunPrediction = async () => {
    setIsPredicting(true);
    setPredictedScenario(null);

    try {
      const res = await fetch('/api/predict-upcoming-cyclone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          basin,
          sstAnomaly,
          leadTimeHours,
          name: cycloneName,
          model: selectedModel
        })
      });

      const json = await res.json();
      if (json.success && json.data) {
        setPredictedScenario(json.data);
        setPredictionMeta({ mode: json.mode, model_used: json.model_used });
      }
    } catch (e) {
      console.error('Failed to run AI upcoming cyclone prediction:', e);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleLoadIntoSystem = () => {
    if (predictedScenario) {
      onApplyScenario(predictedScenario);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[90vh] flex flex-col rounded-2xl border border-[var(--glass-line)] shadow-2xl overflow-hidden text-[var(--ink)]"
        style={{
          background: 'linear-gradient(145deg, rgba(24, 20, 48, 0.94) 0%, rgba(14, 11, 30, 0.98) 100%)'
        }}
      >
        {/* Header */}
        <div className="p-6 border-b border-[var(--glass-line)] flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold font-serif tracking-tight text-white">
                  Anticipatory Cyclone Forecaster
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-mono tracking-widest uppercase bg-purple-500/20 text-purple-300 rounded border border-purple-500/30">
                  AI Cyclogenesis Engine
                </span>
              </div>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                Generate anticipatory future storm trajectories & hydrodynamic breach models beyond historical archives.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-[var(--ink-soft)] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar">
          {/* Controls Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-xl bg-black/30 border border-white/5">
            {/* Basin Selection */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--ink-soft)] mb-2">
                Ocean Basin
              </label>
              <select
                value={basin}
                onChange={(e) => setBasin(e.target.value)}
                className="w-full bg-[#1F1A3A] border border-[var(--glass-line)] rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-purple-400 font-mono"
              >
                <option value="Bay of Bengal">Bay of Bengal (Active Monsoon Trough)</option>
                <option value="North Arabian Sea">North Arabian Sea (Gujarat / Saurashtra)</option>
                <option value="South Indian Ocean">South Indian Ocean Basin</option>
              </select>
            </div>

            {/* SST Anomaly */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[var(--ink-soft)]">
                  SST Thermal Forcing
                </label>
                <span className="text-xs font-mono font-bold text-amber-300">
                  +{sstAnomaly}°C
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.8"
                step="0.1"
                value={sstAnomaly}
                onChange={(e) => setSstAnomaly(parseFloat(e.target.value))}
                className="w-full accent-purple-400 bg-white/10 rounded h-1.5 cursor-pointer"
              />
              <span className="text-[10px] text-[var(--ink-dim)] mt-1 block">
                Higher SST fuels rapid explosive cyclogenesis.
              </span>
            </div>

            {/* Early Warning Horizon */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-[var(--ink-soft)] mb-2">
                Forecast Horizon
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[24, 48, 72].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setLeadTimeHours(hrs)}
                    className={`py-2 text-xs font-mono rounded-lg border transition-all ${
                      leadTimeHours === hrs
                        ? 'bg-purple-600/40 border-purple-400 text-white font-bold shadow-md'
                        : 'bg-[#1F1A3A] border-[var(--glass-line)] text-[var(--ink-soft)] hover:bg-white/5'
                    }`}
                  >
                    T+{hrs}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Model & Name Selection */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 rounded-xl bg-purple-950/20 border border-purple-500/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-purple-300">Inference Engine:</span>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-[#191535] border border-purple-500/40 rounded px-2.5 py-1 text-xs text-purple-200 font-mono focus:outline-none"
              >
                <option value="gemma-4-26b-a4b-it">Gemma 4 (26B A4B IT) - Primary</option>
                <option value="gemini-3.7-flash">Gemini 3.7 Flash - High Throughput</option>
                <option value="gemini-3.8-flash">Gemini 3.8 Flash - Multi-Surface</option>
              </select>
            </div>

            <button
              onClick={handleRunPrediction}
              disabled={isPredicting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-sm font-semibold tracking-wide shadow-lg shadow-purple-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {isPredicting ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  Synthesizing Physics & Track...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Generate Anticipatory Forecast
                </>
              )}
            </button>
          </div>

          {/* Prediction Result Display */}
          {predictedScenario && (
            <div className="p-5 rounded-2xl bg-black/40 border border-purple-500/30 space-y-4 animate-in fade-in slide-in-from-bottom-3 duration-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <h3 className="text-lg font-bold text-white font-serif">
                      {predictedScenario.name}
                    </h3>
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-purple-500/30 text-purple-200 rounded border border-purple-400/40">
                      {predictedScenario.codeName}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[var(--ink-soft)] mt-1 font-mono">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-purple-300" />
                      {predictedScenario.region}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-amber-300 font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      {predictedScenario.targetLandfallDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-1 rounded">
                    Confidence: {predictedScenario.confidencePct || 94.2}%
                  </span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-[#191535] border border-white/5">
                  <div className="text-[11px] font-mono text-[var(--ink-dim)] uppercase">Category</div>
                  <div className="text-sm font-bold text-rose-300 mt-1 truncate">
                    {predictedScenario.category}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#191535] border border-white/5">
                  <div className="text-[11px] font-mono text-[var(--ink-dim)] uppercase">Peak Wind</div>
                  <div className="text-sm font-bold text-cyan-300 mt-1 flex items-baseline gap-1">
                    {predictedScenario.peakWindKmh}
                    <span className="text-xs font-normal text-[var(--ink-soft)]">km/h</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#191535] border border-white/5">
                  <div className="text-[11px] font-mono text-[var(--ink-dim)] uppercase">Central Pressure</div>
                  <div className="text-sm font-bold text-amber-300 mt-1 flex items-baseline gap-1">
                    {predictedScenario.minPressureHpa}
                    <span className="text-xs font-normal text-[var(--ink-soft)]">hPa</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#191535] border border-white/5">
                  <div className="text-[11px] font-mono text-[var(--ink-dim)] uppercase">Peak Storm Surge</div>
                  <div className="text-sm font-bold text-purple-300 mt-1 flex items-baseline gap-1">
                    +{predictedScenario.maxSurgeM}
                    <span className="text-xs font-normal text-[var(--ink-soft)]">m MSL</span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div className="p-3.5 rounded-xl bg-purple-900/20 border border-purple-500/20 text-xs text-[var(--ink-soft)] leading-relaxed">
                <span className="text-purple-300 font-semibold font-mono mr-1">
                  ANTICIPATORY HAZARD ASSESSMENT:
                </span>
                {predictedScenario.summary}
              </div>

              {/* Track Progression Preview */}
              <div>
                <div className="text-xs font-mono uppercase tracking-wider text-[var(--ink-soft)] mb-2 flex items-center justify-between">
                  <span>Projected Track Progression (Hours to Landfall)</span>
                  <span className="text-[10px] text-purple-300">Model: {predictionMeta?.model_used || selectedModel}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  {predictedScenario.trackPoints.map((tp, idx) => (
                    <div 
                      key={idx}
                      className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-[11px] font-mono space-y-1"
                    >
                      <div className="text-purple-300 font-bold flex justify-between">
                        <span>{tp.label}</span>
                        <span className="text-cyan-300">{tp.windSpeedKmh} km/h</span>
                      </div>
                      <div className="text-[var(--ink-dim)] text-[10px] truncate">
                        {tp.lat.toFixed(2)}°N, {tp.lon.toFixed(2)}°E
                      </div>
                      <div className="text-amber-200 text-[10px]">
                        Surge: +{tp.surgeHeightM}m
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleLoadIntoSystem}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Load Upcoming Scenario into Command Center
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
