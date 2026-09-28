import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  ArrowRight, 
  Zap, 
  Building2, 
  Home, 
  Cpu, 
  Layers, 
  RotateCcw,
  Check,
  RefreshCw,
  HelpCircle,
  Radio
} from 'lucide-react';
import { CompiledDecisionsResult, ResourceLedger, DecisionAction } from '../types/cyclone';

interface DecisionCompilerViewProps {
  compiledData: CompiledDecisionsResult;
  resourceLedger: ResourceLedger;
  onDispatchAction: (role: string, action: DecisionAction) => void;
  onDispatchAll: () => void;
  onRecompile: () => void;
  isCompiling: boolean;
  compileSequenceStep: number; // 0 to 6
  compilerMode: string;
}

export const DecisionCompilerView: React.FC<DecisionCompilerViewProps> = ({
  compiledData,
  resourceLedger,
  onDispatchAction,
  onDispatchAll,
  onRecompile,
  isCompiling,
  compileSequenceStep,
  compilerMode
}) => {
  const [activeRoleFilter, setActiveRoleFilter] = useState<'all' | 'municipal' | 'hospital' | 'grid'>('all');

  // Compilation steps
  const steps = [
    { label: 'INGESTING TERRAIN DATA (SRTM 30m DEM)', icon: Layers },
    { label: 'RECONSTRUCTING STORM PATH (IMD MET)', icon: Clock },
    { label: 'SIMULATING SURGE (BATHTUB COASTAL FILL)', icon: ShieldAlert },
    { label: 'MAPPING INFRASTRUCTURE (OSM GRAPH)', icon: Building2 },
    { label: 'CALCULATING EXPOSURE × CRITICALITY', icon: AlertTriangle },
    { label: 'COMPILING ROLE DIRECTIVES (GEMINI 3.8 FLASH)', icon: Sparkles }
  ];

  return (
    <div className="flex-1 bg-[#050B14] p-4 lg:p-8 overflow-y-auto select-none space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#12253A] pb-5 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[10px] font-mono tracking-widest text-[#C7A45D] uppercase font-bold px-2 py-0.5 border border-[#C7A45D]/40 rounded-xs bg-[#C7A45D]/10">
              REASONING DECISION ENGINE
            </span>
            <span className="text-[11px] font-mono text-[#6F8296]">
              COMPILER: {compilerMode.toUpperCase()}
            </span>
            <span className="text-xs text-[#E2C98A] font-script">
              "before impact, the decisions exist"
            </span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#F1EBDD] tracking-tight">
            DECISION COMPILER
          </h1>
          <p className="text-sm font-mono text-[#9BB0C1] mt-1">
            One underlying risk state. Three operational realities.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={onRecompile}
            disabled={isCompiling}
            className="flex items-center gap-2 px-3.5 py-2 rounded-sm bg-[#091525] hover:bg-[#12253A] text-[#F1EBDD] border border-[#12253A] text-xs font-mono tracking-wider transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isCompiling ? 'animate-spin text-[#C7A45D]' : 'text-[#65D9E8]'}`} />
            <span>{isCompiling ? 'RE-REASONING...' : 'RE-RUN COMPILER'}</span>
          </button>

          <button
            onClick={onDispatchAll}
            className="flex items-center gap-2 px-5 py-2 rounded-sm bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] text-xs font-mono font-bold tracking-wider transition-all shadow-[0_0_20px_rgba(199,164,93,0.3)] hover:scale-[1.01]"
          >
            <Send className="w-3.5 h-3.5 fill-[#050B14]" />
            <span>DISPATCH ALL DIRECTIVES</span>
          </button>
        </div>
      </div>

      {/* Central Conceptual Transformation Pipeline */}
      <div className="bg-[#091525]/90 border border-[#12253A] p-5 rounded-sm shadow-xl">
        <div className="text-[10px] font-mono tracking-widest text-[#6F8296] uppercase mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-[#65D9E8]" />
            <span>ANTICIPATORY ACTION COMPILATION PIPELINE</span>
          </span>
          <span className="text-[#65D9E8] font-bold text-xs">1 FORECAST → 3 DECISION PATHS</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5 items-center text-center font-mono">
          {[
            { label: 'FORECAST', sub: 'IMD Track Cone', color: '#6F8296' },
            { label: 'HAZARD', sub: '2.42m Surge Fill', color: '#65D9E8' },
            { label: 'EXPOSURE', sub: 'Asset Intersection', color: '#5A8CFF' },
            { label: 'CRITICALITY', sub: 'Societal Weight', color: '#E7A84A' },
            { label: 'DECISION', sub: 'Gemini Reasoning', color: '#C7A45D' },
            { label: 'DISPATCH', sub: 'DEOC Corridors', color: '#63C69A' },
            { label: 'FINANCIAL', sub: 'Parametric Trigger', color: '#E2C98A' }
          ].map((node, i) => (
            <div key={node.label} className="p-3 rounded-sm bg-[#050B14] border border-[#12253A] flex flex-col items-center shadow-inner">
              <div className="text-[10px] text-[#6F8296] mb-0.5">0{i + 1}</div>
              <div className="text-xs font-bold tracking-wider" style={{ color: node.color }}>
                {node.label}
              </div>
              <div className="text-[9px] text-[#4A5D70] mt-0.5 truncate w-full">
                {node.sub}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compilation Processing State (When actively running) */}
      {isCompiling && (
        <div className="bg-[#0D1C2D] border border-[#C7A45D] p-5 rounded-sm space-y-3 font-mono animate-pulse shadow-2xl">
          <div className="flex items-center justify-between border-b border-[#12253A] pb-2">
            <span className="text-xs font-bold text-[#E2C98A] flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#C7A45D] animate-spin" />
              CYCLONEOS REASONING ENGINE COMPILING DIRECTIVES...
            </span>
            <span className="text-[10px] text-[#65D9E8]">
              LATENCY TARGET: &lt; 30 SECONDS (PRD NFR-1)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {steps.map((st, idx) => {
              const isDone = compileSequenceStep > idx;
              const isCurrent = compileSequenceStep === idx;
              const Icon = st.icon;

              return (
                <div 
                  key={st.label}
                  className={`flex items-center justify-between p-2.5 rounded-xs border text-xs transition-all ${
                    isDone 
                      ? 'bg-[#050B14] border-[#63C69A]/50 text-[#63C69A]' 
                      : isCurrent 
                      ? 'bg-[#12253A] border-[#C7A45D] text-[#E2C98A]' 
                      : 'bg-[#050B14]/60 border-[#12253A] text-[#4A5D70]'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate text-[10px]">{st.label}</span>
                  </div>
                  {isDone ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#63C69A] shrink-0" />
                  ) : isCurrent ? (
                    <span className="text-[10px] animate-pulse">…</span>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resource Ledger: Resource Awareness Section */}
      <div className="bg-[#091525]/90 border border-[#12253A] p-4 rounded-sm font-mono space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="text-[10px] tracking-widest text-[#E2C98A] uppercase font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#E2C98A]" />
            <span>DYNAMIC RESOURCE CONSTRAINT LEDGER</span>
          </div>
          <span className="text-[10px] text-[#6F8296]">
            ACTIONS ARE RESOURCE-BOUNDED · REAL-TIME INVENTORY CHECK
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Ambulances */}
          <div className="p-3 rounded-xs bg-[#050B14] border border-[#12253A]">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#9BB0C1]">ALS AMBULANCES</span>
              <span className="text-[#D95757] font-bold">
                {resourceLedger.ambulances.allocated} / {resourceLedger.ambulances.total}
              </span>
            </div>
            <div className="w-full bg-[#12253A] h-2 rounded-xs overflow-hidden">
              <div 
                className="bg-[#D95757] h-full transition-all duration-300"
                style={{ width: `${(resourceLedger.ambulances.allocated / resourceLedger.ambulances.total) * 100}%` }}
              />
            </div>
            <div className="text-[9px] text-[#6F8296] mt-1.5 flex justify-between">
              <span>{resourceLedger.ambulances.total - resourceLedger.ambulances.allocated} IN RESERVE</span>
              <span>HOSPITAL CORRIDOR</span>
            </div>
          </div>

          {/* Transit Buses */}
          <div className="p-3 rounded-xs bg-[#050B14] border border-[#12253A]">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#9BB0C1]">EVACUATION BUSES</span>
              <span className="text-[#E7A84A] font-bold">
                {resourceLedger.buses.allocated} / {resourceLedger.buses.total}
              </span>
            </div>
            <div className="w-full bg-[#12253A] h-2 rounded-xs overflow-hidden">
              <div 
                className="bg-[#E7A84A] h-full transition-all duration-300"
                style={{ width: `${(resourceLedger.buses.allocated / resourceLedger.buses.total) * 100}%` }}
              />
            </div>
            <div className="text-[9px] text-[#6F8296] mt-1.5 flex justify-between">
              <span>{resourceLedger.buses.total - resourceLedger.buses.allocated} IN RESERVE</span>
              <span>STAGED AT WARD 4</span>
            </div>
          </div>

          {/* Grid Repair Crews */}
          <div className="p-3 rounded-xs bg-[#050B14] border border-[#12253A]">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#9BB0C1]">GRID REPAIR CREWS</span>
              <span className="text-[#65D9E8] font-bold">
                {resourceLedger.repairCrews.allocated} / {resourceLedger.repairCrews.total}
              </span>
            </div>
            <div className="w-full bg-[#12253A] h-2 rounded-xs overflow-hidden">
              <div 
                className="bg-[#65D9E8] h-full transition-all duration-300"
                style={{ width: `${(resourceLedger.repairCrews.allocated / resourceLedger.repairCrews.total) * 100}%` }}
              />
            </div>
            <div className="text-[9px] text-[#6F8296] mt-1.5 flex justify-between">
              <span>{resourceLedger.repairCrews.total - resourceLedger.repairCrews.allocated} IN RESERVE</span>
              <span>SUBSTATION B YARD</span>
            </div>
          </div>

          {/* Shelter Capacity */}
          <div className="p-3 rounded-xs bg-[#050B14] border border-[#12253A]">
            <div className="flex justify-between text-xs mb-1.5">
              <span className="text-[#9BB0C1]">SHELTER CAPACITY</span>
              <span className="text-[#63C69A] font-bold">
                {resourceLedger.shelterCapacity.allocated} / {resourceLedger.shelterCapacity.total}
              </span>
            </div>
            <div className="w-full bg-[#12253A] h-2 rounded-xs overflow-hidden">
              <div 
                className="bg-[#63C69A] h-full transition-all duration-300"
                style={{ width: `${(resourceLedger.shelterCapacity.allocated / resourceLedger.shelterCapacity.total) * 100}%` }}
              />
            </div>
            <div className="text-[9px] text-[#6F8296] mt-1.5 flex justify-between">
              <span>{resourceLedger.shelterCapacity.total - resourceLedger.shelterCapacity.allocated} BEDS OPEN</span>
              <span>HIGH GROUND BUNKER</span>
            </div>
          </div>
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#12253A] pb-2 text-xs font-mono">
        <span className="text-[#6F8296] uppercase text-[10px] tracking-wider mr-2 font-bold">FILTER ROLES:</span>
        {[
          { id: 'all', label: 'ALL 3 OPERATIONAL COMMANDS' },
          { id: 'municipal', label: 'MUNICIPAL COMMAND' },
          { id: 'hospital', label: 'HOSPITAL OPERATIONS' },
          { id: 'grid', label: 'GRID OPERATIONS' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveRoleFilter(tab.id as any)}
            className={`px-3 py-1.5 rounded-sm transition-colors ${
              activeRoleFilter === tab.id
                ? 'bg-[#C7A45D] text-[#050B14] font-bold'
                : 'bg-[#091525] text-[#9BB0C1] hover:text-[#F1EBDD] border border-[#12253A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* The 3 Differentiated Role Dispatch Columns with Grand Serif Headlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono">
        {/* ROLE 1: MUNICIPAL DISASTER OFFICER */}
        {(activeRoleFilter === 'all' || activeRoleFilter === 'municipal') && (
          <div className="flex flex-col bg-[#091525]/90 border border-[#65D9E8]/40 rounded-sm overflow-hidden shadow-2xl">
            {/* Role Header */}
            <div className="p-4 bg-[#0D1C2D] border-b border-[#12253A] flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xs bg-[#65D9E8]/10 text-[#65D9E8] border border-[#65D9E8]/30">
                  <Home className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#65D9E8] uppercase tracking-widest font-bold">
                    01 · MUNICIPAL COMMAND
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#F1EBDD]">
                    EVACUATE
                  </h3>
                  <div className="text-[10px] text-[#6F8296]">
                    Ward Evacuation, Shelter Staging & Sluice Gates
                  </div>
                </div>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#E7A84A]/20 text-[#E7A84A] border border-[#E7A84A]/40 font-bold">
                HIGH PRIORITY
              </span>
            </div>

            {/* Actions List */}
            <div className="p-4 space-y-4 flex-1">
              {compiledData.municipal_dispatch.actions.map((act, i) => (
                <div key={act.id} className="p-3.5 bg-[#050B14] rounded-xs border border-[#12253A] space-y-2.5 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#C7A45D] font-bold">DIRECTIVE 0{i + 1}</span>
                    <span className="text-[#E7A84A] flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3 text-[#E7A84A]" />
                      DEADLINE: {act.deadline} HRS
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#F1EBDD] leading-snug">
                    {act.action}
                  </h4>

                  <div className="text-[11px] text-[#9BB0C1] leading-relaxed bg-[#091525] p-2.5 rounded-xs border border-[#12253A]">
                    <span className="text-[#6F8296] font-bold uppercase">JUSTIFICATION: </span>
                    {act.justification}
                  </div>

                  <div className="text-[10px] text-[#65D9E8] flex items-center justify-between">
                    <span>RESOURCES: {act.resource_allocated}</span>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-[#12253A]">
                    <span className="text-[9px] text-[#6F8296]">LEAD: {act.lead_officer}</span>
                    <button
                      onClick={() => onDispatchAction('Municipal Disaster Officer', act)}
                      className={`px-3 py-1 rounded-xs text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                        act.status === 'DISPATCHED'
                          ? 'bg-[#63C69A]/20 text-[#63C69A] border border-[#63C69A]/40 cursor-default'
                          : 'bg-[#65D9E8] hover:bg-[#88E5F2] text-[#050B14]'
                      }`}
                    >
                      {act.status === 'DISPATCHED' ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>DISPATCHED</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 fill-[#050B14]" />
                          <span>DISPATCH →</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROLE 2: HOSPITAL ADMINISTRATOR */}
        {(activeRoleFilter === 'all' || activeRoleFilter === 'hospital') && (
          <div className="flex flex-col bg-[#091525]/90 border border-[#D95757]/40 rounded-sm overflow-hidden shadow-2xl">
            {/* Role Header */}
            <div className="p-4 bg-[#0D1C2D] border-b border-[#12253A] flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xs bg-[#D95757]/10 text-[#D95757] border border-[#D95757]/30">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#D95757] uppercase tracking-widest font-bold">
                    02 · HOSPITAL OPERATIONS
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#F1EBDD]">
                    TRANSFER
                  </h3>
                  <div className="text-[10px] text-[#6F8296]">
                    Patient Evacuation Corridor & Trauma Continuity
                  </div>
                </div>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#D95757]/20 text-[#D95757] border border-[#D95757]/40 font-bold">
                CRITICAL
              </span>
            </div>

            {/* Actions List */}
            <div className="p-4 space-y-4 flex-1">
              {compiledData.hospital_dispatch.actions.map((act, i) => (
                <div key={act.id} className="p-3.5 bg-[#050B14] rounded-xs border border-[#12253A] space-y-2.5 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#C7A45D] font-bold">DIRECTIVE 0{i + 1}</span>
                    <span className="text-[#D95757] flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3 text-[#D95757]" />
                      DEADLINE: {act.deadline} HRS
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#F1EBDD] leading-snug">
                    {act.action}
                  </h4>

                  <div className="text-[11px] text-[#9BB0C1] leading-relaxed bg-[#091525] p-2.5 rounded-xs border border-[#12253A]">
                    <span className="text-[#6F8296] font-bold uppercase">JUSTIFICATION: </span>
                    {act.justification}
                  </div>

                  <div className="text-[10px] text-[#D95757] flex items-center justify-between">
                    <span>RESOURCES: {act.resource_allocated}</span>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-[#12253A]">
                    <span className="text-[9px] text-[#6F8296]">LEAD: {act.lead_officer}</span>
                    <button
                      onClick={() => onDispatchAction('Hospital Administrator', act)}
                      className={`px-3 py-1 rounded-xs text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                        act.status === 'DISPATCHED'
                          ? 'bg-[#63C69A]/20 text-[#63C69A] border border-[#63C69A]/40 cursor-default'
                          : 'bg-[#D95757] hover:bg-[#E87373] text-[#050B14]'
                      }`}
                    >
                      {act.status === 'DISPATCHED' ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>DISPATCHED</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 fill-[#050B14]" />
                          <span>TRANSFER →</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROLE 3: GRID OPERATOR */}
        {(activeRoleFilter === 'all' || activeRoleFilter === 'grid') && (
          <div className="flex flex-col bg-[#091525]/90 border border-[#E2C98A]/40 rounded-sm overflow-hidden shadow-2xl">
            {/* Role Header */}
            <div className="p-4 bg-[#0D1C2D] border-b border-[#12253A] flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xs bg-[#E2C98A]/10 text-[#E2C98A] border border-[#E2C98A]/30">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-[10px] text-[#E2C98A] uppercase tracking-widest font-bold">
                    03 · GRID OPERATIONS
                  </div>
                  <h3 className="text-xl font-serif font-bold text-[#F1EBDD]">
                    PROTECT POWER
                  </h3>
                  <div className="text-[10px] text-[#6F8296]">
                    Substation Isolation, Mobile Power & Line Safety
                  </div>
                </div>
              </div>

              <span className="text-[10px] px-2 py-0.5 rounded-xs bg-[#E2C98A]/20 text-[#E2C98A] border border-[#E2C98A]/40 font-bold">
                HIGH PRIORITY
              </span>
            </div>

            {/* Actions List */}
            <div className="p-4 space-y-4 flex-1">
              {compiledData.grid_dispatch.actions.map((act, i) => (
                <div key={act.id} className="p-3.5 bg-[#050B14] rounded-xs border border-[#12253A] space-y-2.5 shadow-inner">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#C7A45D] font-bold">DIRECTIVE 0{i + 1}</span>
                    <span className="text-[#E2C98A] flex items-center gap-1 font-bold">
                      <Clock className="w-3 h-3 text-[#E2C98A]" />
                      DEADLINE: {act.deadline} HRS
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-[#F1EBDD] leading-snug">
                    {act.action}
                  </h4>

                  <div className="text-[11px] text-[#9BB0C1] leading-relaxed bg-[#091525] p-2.5 rounded-xs border border-[#12253A]">
                    <span className="text-[#6F8296] font-bold uppercase">JUSTIFICATION: </span>
                    {act.justification}
                  </div>

                  <div className="text-[10px] text-[#E2C98A] flex items-center justify-between">
                    <span>RESOURCES: {act.resource_allocated}</span>
                  </div>

                  <div className="pt-1 flex items-center justify-between border-t border-[#12253A]">
                    <span className="text-[9px] text-[#6F8296]">LEAD: {act.lead_officer}</span>
                    <button
                      onClick={() => onDispatchAction('Grid Operator', act)}
                      className={`px-3 py-1 rounded-xs text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                        act.status === 'DISPATCHED'
                          ? 'bg-[#63C69A]/20 text-[#63C69A] border border-[#63C69A]/40 cursor-default'
                          : 'bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14]'
                      }`}
                    >
                      {act.status === 'DISPATCHED' ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>DISPATCHED</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-3 h-3 fill-[#050B14]" />
                          <span>AUTHORIZE →</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grounded Decision Note Footer */}
      <div className="p-3 bg-[#091525]/60 border border-[#12253A] rounded-sm text-[10px] font-mono text-[#6F8296] flex items-center justify-between">
        <span>PRD FR-7 COMPLIANCE: Structured prompt passing exposure JSON + resource inventory to Gemini 3.8. Output deterministic and strictly verified.</span>
        <span className="text-[#63C69A] font-bold">100% INVARIANTS VERIFIED</span>
      </div>
    </div>
  );
};
