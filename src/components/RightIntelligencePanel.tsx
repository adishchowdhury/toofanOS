import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  Zap, 
  Home,
  CheckCircle2,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';
import { InfrastructureAsset } from '../types/cyclone';

interface RightIntelligencePanelProps {
  priorityAssets: InfrastructureAsset[];
  onSelectAsset: (asset: InfrastructureAsset) => void;
  onCompileDecisions: () => void;
  isCompiling: boolean;
  activeDispatchesCount: number;
}

export const RightIntelligencePanel: React.FC<RightIntelligencePanelProps> = ({
  priorityAssets,
  onSelectAsset,
  onCompileDecisions,
  isCompiling,
  activeDispatchesCount
}) => {
  return (
    <aside className="w-84 border-l border-[#12253A] bg-[#050B14] flex flex-col justify-between select-none shadow-2xl">
      {/* Panel Header */}
      <div className="p-4 border-b border-[#12253A] space-y-1.5 bg-[#091525]/60">
        <div className="flex items-center justify-between">
          <div className="text-[10px] font-mono tracking-widest text-[#E7A84A] uppercase font-bold flex items-center gap-1.5">
            <AlertOctagon className="w-3.5 h-3.5 text-[#E7A84A]" />
            <span>OPERATIONAL PRIORITY</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-xs bg-[#D95757]/20 text-[#D95757] border border-[#D95757]/40 font-bold">
            3 IMMINENT
          </span>
        </div>

        <h2 className="text-xl font-serif font-bold text-[#F1EBDD] tracking-wide leading-tight">
          WHAT <br />
          REQUIRES <br />
          ACTION?
        </h2>
        
        <p className="text-[10px] font-mono text-[#6F8296] leading-tight">
          Ranked by deterministic exposure index × asset societal criticality.
        </p>
      </div>

      {/* Priority Asset Cards List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {priorityAssets.slice(0, 3).map((asset, index) => {
          const rank = `0${index + 1}`;
          const isCritical = asset.criticality >= 0.95;

          const actionSummary = 
            asset.type === 'hospital' 
              ? 'Prepare patient transfer corridor along NH-116B before road cut-off.'
              : asset.type === 'substation'
              ? 'Stage 500kVA mobile generator & isolate switchyard before marine surge.'
              : 'Mobilize 4 evacuation buses for coastal settlements.';

          return (
            <div
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className="group p-3.5 rounded-sm bg-[#091525]/80 hover:bg-[#0D1C2D] border border-[#12253A] hover:border-[#C7A45D]/70 transition-all cursor-pointer relative shadow-md"
            >
              {/* Rank & Criticality */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-mono text-xs font-bold text-[#C7A45D]">
                  {rank}
                </span>

                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-xs border ${
                    isCritical 
                      ? 'bg-[#D95757]/20 text-[#D95757] border-[#D95757]/40' 
                      : 'bg-[#E7A84A]/20 text-[#E7A84A] border-[#E7A84A]/40'
                  }`}>
                    {isCritical ? 'CRITICAL' : 'HIGH'}
                  </span>
                  <span className="text-[10px] font-mono text-[#65D9E8] flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3 text-[#65D9E8]" />
                    ETA 0{asset.surgeEtaHours.toFixed(1)}:00
                  </span>
                </div>
              </div>

              {/* Asset Name */}
              <div className="flex items-start gap-2.5 mb-2">
                {asset.type === 'hospital' && <Building2 className="w-4 h-4 text-[#D95757] shrink-0 mt-0.5" />}
                {asset.type === 'substation' && <Zap className="w-4 h-4 text-[#E2C98A] shrink-0 mt-0.5" />}
                {asset.type === 'shelter' && <Home className="w-4 h-4 text-[#65D9E8] shrink-0 mt-0.5" />}
                <div>
                  <h4 className="text-xs font-mono font-bold text-[#F1EBDD] group-hover:text-[#E2C98A] transition-colors">
                    {asset.name}
                  </h4>
                  <div className="text-[10px] font-mono text-[#6F8296]">
                    Exposure: <span className="text-[#F1EBDD] font-medium">{asset.exposureScore.toFixed(2)}</span> · Elev: +{asset.elevationM}m
                  </div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="text-[11px] font-mono text-[#9BB0C1] leading-relaxed bg-[#050B14]/80 p-2.5 rounded-xs border border-[#12253A] mb-2.5">
                {actionSummary}
              </div>

              {/* Card Footer CTA */}
              <div className="flex items-center justify-between text-[10px] font-mono text-[#6F8296] group-hover:text-[#C7A45D] transition-colors border-t border-[#12253A] pt-2">
                <span className="tracking-wider">INSPECT GEOMETRY</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Compile Action CTA */}
      <div className="p-4 border-t border-[#12253A] bg-[#091525]/90 space-y-2">
        <button
          onClick={onCompileDecisions}
          disabled={isCompiling}
          className="w-full py-2.5 px-3 rounded-sm bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] font-mono text-xs font-bold tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(199,164,93,0.3)] disabled:opacity-50 hover:scale-[1.01]"
        >
          <Sparkles className="w-4 h-4 fill-[#050B14]" />
          <span>{isCompiling ? 'COMPILING INTELLIGENCE...' : 'COMPILE 3 ROLE DECISIONS'}</span>
        </button>

        <div className="text-[9px] font-mono text-[#6F8296] text-center">
          Synthesizes Municipal, Hospital & Grid Directives via Gemini 3.8
        </div>
      </div>
    </aside>
  );
};
