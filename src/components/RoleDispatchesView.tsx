import React, { useState } from 'react';
import { 
  Send, 
  CheckCircle2, 
  Clock, 
  Building2, 
  Zap, 
  Home, 
  Radio, 
  Check, 
  ArrowUpRight,
  ExternalLink,
  ShieldAlert,
  Server,
  Terminal
} from 'lucide-react';
import { CompiledDecisionsResult, DecisionAction } from '../types/cyclone';

interface RoleDispatchesViewProps {
  compiledData: CompiledDecisionsResult;
  onDispatchAction: (role: string, action: DecisionAction) => void;
  deliveryLogs: Array<{
    id: string;
    role: string;
    actionText: string;
    timestamp: string;
    status: string;
    receiptHash: string;
    transport: string;
  }>;
}

export const RoleDispatchesView: React.FC<RoleDispatchesViewProps> = ({
  compiledData,
  onDispatchAction,
  deliveryLogs
}) => {
  const [filterRole, setFilterRole] = useState<'all' | 'municipal' | 'hospital' | 'grid'>('all');
  const [reviewingAction, setReviewingAction] = useState<{ role: string; action: DecisionAction } | null>(null);

  const allActions = [
    ...compiledData.municipal_dispatch.actions.map(a => ({ role: 'Municipal Disaster Officer', action: a })),
    ...compiledData.hospital_dispatch.actions.map(a => ({ role: 'Hospital Administrator', action: a })),
    ...compiledData.grid_dispatch.actions.map(a => ({ role: 'Grid Operator', action: a }))
  ];

  const filtered = allActions.filter(item => {
    if (filterRole === 'municipal') return item.role === 'Municipal Disaster Officer';
    if (filterRole === 'hospital') return item.role === 'Hospital Administrator';
    if (filterRole === 'grid') return item.role === 'Grid Operator';
    return true;
  });

  return (
    <div className="flex-1 bg-[#050B14] p-4 lg:p-8 overflow-y-auto select-none space-y-6">
      {/* Header */}
      <div className="border-b border-[#12253A] pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] font-mono tracking-widest text-[#63C69A] uppercase font-bold px-2 py-0.5 border border-[#63C69A]/40 rounded-xs bg-[#63C69A]/10">
            DISPATCH AUTOMATION CONSOLE
          </span>
          <span className="text-[11px] font-mono text-[#6F8296]">
            MOCK WEBHOOK / SMS GATEWAY ACTIVE
          </span>
          <span className="text-xs text-[#E2C98A] font-script">
            "protect what matters"
          </span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#F1EBDD] tracking-tight">
          ROLE DISPATCHES
        </h1>
        <p className="text-sm font-mono text-[#9BB0C1] mt-1">
          Pre-formatted, authenticated directives dispatched directly into field incident management systems.
        </p>
      </div>

      {/* Role Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#12253A] pb-2 text-xs font-mono">
        {[
          { id: 'all', label: `ALL DIRECTIVES (${allActions.length})` },
          { id: 'municipal', label: `MUNICIPAL (${compiledData.municipal_dispatch.actions.length})` },
          { id: 'hospital', label: `HOSPITAL (${compiledData.hospital_dispatch.actions.length})` },
          { id: 'grid', label: `GRID OPERATOR (${compiledData.grid_dispatch.actions.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilterRole(tab.id as any)}
            className={`px-3 py-1.5 rounded-sm transition-colors ${
              filterRole === tab.id
                ? 'bg-[#C7A45D] text-[#050B14] font-bold'
                : 'bg-[#091525] text-[#9BB0C1] hover:text-[#F1EBDD] border border-[#12253A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 font-mono">
        {/* Left: Dispatch Cards List */}
        <div className="xl:col-span-2 space-y-4">
          {filtered.map(({ role, action }) => {
            const isDispatched = action.status === 'DISPATCHED';

            return (
              <div 
                key={action.id}
                className="p-4 rounded-sm bg-[#091525]/90 border border-[#12253A] hover:border-[#C7A45D]/60 transition-all space-y-3 shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {role.includes('Municipal') && <Home className="w-4 h-4 text-[#65D9E8]" />}
                    {role.includes('Hospital') && <Building2 className="w-4 h-4 text-[#D95757]" />}
                    {role.includes('Grid') && <Zap className="w-4 h-4 text-[#E2C98A]" />}
                    <span className="text-xs font-bold text-[#F1EBDD]">{role}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-xs font-bold ${
                      isDispatched
                        ? 'bg-[#63C69A]/20 text-[#63C69A] border border-[#63C69A]/40'
                        : 'bg-[#E7A84A]/20 text-[#E7A84A] border border-[#E7A84A]/40'
                    }`}>
                      {isDispatched ? '✓ DELIVERED' : 'READY TO SEND'}
                    </span>
                    <span className="text-[10px] text-[#6F8296] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      DEADLINE: {action.deadline}
                    </span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-[#F1EBDD]">
                  {action.action}
                </h3>

                <div className="text-xs text-[#9BB0C1] leading-relaxed bg-[#050B14] p-3 rounded-xs border border-[#12253A]">
                  <span className="text-[#6F8296] font-bold uppercase">JUSTIFICATION: </span>
                  {action.justification}
                </div>

                <div className="text-[11px] text-[#65D9E8] flex justify-between">
                  <span>ALLOCATION: {action.resource_allocated}</span>
                  <span className="text-[#6F8296]">LEAD: {action.lead_officer}</span>
                </div>

                {isDispatched && action.deliveryHash && (
                  <div className="text-[10px] text-[#63C69A] bg-[#050B14] p-2 rounded-xs border border-[#63C69A]/30 flex items-center justify-between shadow-inner">
                    <span>ACKNOWLEDGED VIA DEOC WEBHOOK: {action.deliveryHash}</span>
                    <span>HTTP 200 OK</span>
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#12253A]">
                  <button
                    onClick={() => setReviewingAction({ role, action })}
                    className="px-3 py-1.5 rounded-xs bg-[#050B14] hover:bg-[#12253A] text-[#9BB0C1] hover:text-[#F1EBDD] text-xs transition-colors border border-[#12253A]"
                  >
                    REVIEW PAYLOAD
                  </button>

                  <button
                    onClick={() => onDispatchAction(role, action)}
                    className={`px-4 py-1.5 rounded-xs text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
                      isDispatched
                        ? 'bg-[#63C69A]/20 text-[#63C69A] border border-[#63C69A]/40 cursor-default'
                        : 'bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14]'
                    }`}
                  >
                    {isDispatched ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>DELIVERED</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3 h-3 fill-[#050B14]" />
                        <span>DISPATCH DIRECTIVE</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Live Delivery Activity Feed */}
        <div className="space-y-4">
          <div className="bg-[#091525]/90 border border-[#12253A] p-4 rounded-sm space-y-3 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#12253A] pb-2">
              <span className="text-xs font-bold text-[#E2C98A] flex items-center gap-1.5">
                <Radio className="w-4 h-4 text-[#63C69A] animate-pulse" />
                <span>LIVE DELIVERY ACTIVITY FEED</span>
              </span>
              <span className="text-[10px] text-[#63C69A] font-bold">SIMULATOR ACTIVE</span>
            </div>

            {deliveryLogs.length === 0 ? (
              <div className="py-8 text-center text-[#6F8296] text-xs space-y-2">
                <Server className="w-8 h-8 text-[#12253A] mx-auto" />
                <div>Awaiting dispatches.</div>
                <div className="text-[10px]">Click "Dispatch Directive" to broadcast orders.</div>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {deliveryLogs.map((log) => (
                  <div key={log.id} className="p-2.5 bg-[#050B14] rounded-xs border border-[#12253A] space-y-1 text-xs shadow-inner">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-[#63C69A] font-bold">● {log.status}</span>
                      <span className="text-[#6F8296]">{log.timestamp}</span>
                    </div>
                    <div className="text-[#F1EBDD] font-semibold text-[11px] truncate">
                      {log.role}
                    </div>
                    <div className="text-[10px] text-[#9BB0C1] truncate">
                      {log.actionText}
                    </div>
                    <div className="text-[9px] text-[#6F8296] flex items-center justify-between pt-1 border-t border-[#12253A]/50">
                      <span>TRANSPORT: {log.transport}</span>
                      <span className="text-[#C7A45D]">{log.receiptHash}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {reviewingAction && (
        <div className="fixed inset-0 bg-[#050B14]/85 backdrop-blur-md z-50 flex items-center justify-center p-4 font-mono">
          <div className="bg-[#091525] border border-[#C7A45D] p-6 rounded-sm max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#12253A] pb-2">
              <span className="text-xs font-bold text-[#E2C98A]">
                DISPATCH PAYLOAD PREVIEW
              </span>
              <button 
                onClick={() => setReviewingAction(null)}
                className="text-[#6F8296] hover:text-[#F1EBDD]"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#050B14] rounded-xs text-xs space-y-2 overflow-x-auto text-[#65D9E8]">
              <pre>{JSON.stringify({
                recipient: reviewingAction.role,
                action_id: reviewingAction.action.id,
                action: reviewingAction.action.action,
                deadline_hrs: reviewingAction.action.deadline,
                urgency: reviewingAction.action.urgency,
                resources_allocated: reviewingAction.action.resource_allocated,
                lead_signoff: reviewingAction.action.lead_officer,
                protocol: 'NDRF_CIVIL_DEFENSE_DIRECTIVE_STG4'
              }, null, 2)}</pre>
            </div>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setReviewingAction(null)}
                className="px-4 py-2 rounded-xs bg-[#12253A] text-[#F1EBDD] text-xs"
              >
                CLOSE
              </button>
              <button
                onClick={() => {
                  onDispatchAction(reviewingAction.role, reviewingAction.action);
                  setReviewingAction(null);
                }}
                className="px-4 py-2 rounded-xs bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] text-xs font-bold"
              >
                CONFIRM & TRANSMIT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
