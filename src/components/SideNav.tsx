import React from 'react';
import { 
  Compass, 
  Map as MapIcon, 
  Building2, 
  Sparkles, 
  Send, 
  ShieldCheck, 
  FileText,
  Activity,
  Radio,
  Satellite,
  Cpu,
  Mic
} from 'lucide-react';

interface SideNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  geminiReady: boolean;
  dispatchesCount: number;
  onOpenUpcomingPredictor?: () => void;
}

export const SideNav: React.FC<SideNavProps> = ({
  activeTab,
  setActiveTab,
  geminiReady,
  dispatchesCount,
  onOpenUpcomingPredictor
}) => {
  const navItems = [
    { id: 'command', label: 'Command', sub: 'OPERATIONAL OVERVIEW', icon: Compass },
    { id: 'risk-map', label: 'Risk & Exposure Map', sub: 'SATELLITE & SURGE', icon: MapIcon },
    { id: 'compiler', label: 'Decision Compiler', sub: 'GEMINI 3.8 REASONING', icon: Sparkles, badge: 'AI' },
    { id: 'dispatch', label: 'Role Dispatches', sub: 'MUNICIPAL / HOSP / GRID', icon: Send, count: dispatchesCount },
    { id: 'infrastructure', label: 'Infrastructure', sub: 'CRITICALITY GRAPH', icon: Building2 },
    { id: 'insurance', label: 'Parametric Insurance', sub: 'TRIGGER CERTIFICATE', icon: ShieldCheck, accent: true },
    { id: 'audit', label: 'Audit Trail', sub: 'INPUT HASHES & PROVENANCE', icon: FileText }
  ];

  return (
    <aside className="w-64 border-r border-[#12253A] bg-[#050B14] flex flex-col justify-between select-none shadow-2xl">
      {/* Navigation Links */}
      <div className="p-3 space-y-1">
        {/* Early Warning AI Predictor CTA */}
        {onOpenUpcomingPredictor && (
          <div className="mb-3">
            <button
              onClick={onOpenUpcomingPredictor}
              className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 hover:from-purple-900/80 hover:to-indigo-900/80 border border-purple-500/40 hover:border-purple-300 text-left transition-all shadow-md group cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-purple-300 group-hover:scale-110 transition-transform">
                  <Compass className="w-4 h-4 text-purple-200" />
                </div>
                <div>
                  <div className="text-[11px] font-mono font-bold text-white tracking-wide">
                    Predict Upcoming
                  </div>
                  <div className="text-[9px] font-mono text-purple-300/80">
                    AI Cyclogenesis Engine
                  </div>
                </div>
              </div>
              <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-200 border border-purple-400/30 font-bold uppercase">
                NEW
              </span>
            </button>
          </div>
        )}

        <div className="px-3 py-2 text-[10px] font-mono tracking-widest text-[#6F8296] uppercase font-bold">
          OPERATIONAL MODULES
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-sm transition-all text-left relative group ${
                isActive 
                  ? 'bg-[#0D1C2D] text-[#F1EBDD] border-l-2 border-[#C7A45D] shadow-[inset_0_0_15px_rgba(199,164,93,0.12)]' 
                  : 'text-[#6F8296] hover:text-[#F1EBDD] hover:bg-[#091525]'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-colors ${
                  isActive ? (item.accent ? 'text-[#C7A45D]' : 'text-[#65D9E8]') : 'text-[#6F8296] group-hover:text-[#F1EBDD]'
                }`} />
                <div>
                  <div className={`text-xs font-mono font-medium tracking-wide ${isActive ? 'text-[#F1EBDD] font-bold' : 'text-[#9BB0C1]'}`}>
                    {item.label}
                  </div>
                  <div className="text-[9px] font-mono text-[#4A5D70] tracking-wider uppercase">
                    {item.sub}
                  </div>
                </div>
              </div>

              {item.badge && (
                <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-xs bg-[#65D9E8]/15 text-[#65D9E8] border border-[#65D9E8]/40">
                  {item.badge}
                </span>
              )}

              {item.count !== undefined && item.count > 0 && (
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded-xs bg-[#E7A84A]/20 text-[#E7A84A] border border-[#E7A84A]/40">
                  {item.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Telemetry & Grounded Data Sources */}
      <div className="p-3 border-t border-[#12253A] bg-[#091525]/70 space-y-2.5">
        <div className="text-[10px] font-mono tracking-widest text-[#6F8296] uppercase flex items-center justify-between px-1 font-bold">
          <span>DATA SOURCES</span>
          <span className="text-[9px] text-[#63C69A]">CONNECTED</span>
        </div>

        <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
          <div className="flex items-center gap-1.5 p-1.5 rounded-xs bg-[#050B14] border border-[#65D9E8]/30 text-[#65D9E8]">
            <Satellite className="w-3 h-3 text-[#65D9E8]" />
            <span>EARTH 3D</span>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 rounded-xs bg-[#050B14] border border-[#E7A84A]/30 text-[#E7A84A]">
            <Radio className="w-3 h-3 text-[#E7A84A]" />
            <span>WINDY.COM</span>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 rounded-xs bg-[#050B14] border border-[#63C69A]/30 text-[#63C69A]">
            <MapIcon className="w-3 h-3 text-[#63C69A]" />
            <span>MAPS API</span>
          </div>

          <div className="flex items-center gap-1.5 p-1.5 rounded-xs bg-[#050B14] border border-[#C7A45D]/30 text-[#C7A45D]">
            <Cpu className="w-3 h-3 text-[#C7A45D]" />
            <span>GEMMA 4</span>
          </div>
        </div>

        <div className="px-1 text-[9px] text-[#4A5D70] font-mono leading-tight">
          Gemma 4 (26B) · Gemini 3.7 Flash · Keys in .gitignore
        </div>
      </div>
    </aside>
  );
};
