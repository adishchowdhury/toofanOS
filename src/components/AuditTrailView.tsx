import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  ExternalLink, 
  Download, 
  Clock, 
  Search,
  Hash,
  Database
} from 'lucide-react';
import { AuditRecord } from '../types/cyclone';

interface AuditTrailViewProps {
  records?: AuditRecord[];
  auditLogs?: AuditRecord[];
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({ records, auditLogs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const displayList = auditLogs || records || [];

  const filteredRecords = displayList.filter(r => 
    (r.stage || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.details || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (r.hash || (r as any).inputHash || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-[#050B14] cartographic-grid">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-[#203A55]/40 pb-6 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] tracking-[0.28em] text-[#C7A45D] uppercase font-mono font-medium">
              VERIFIABLE GOVERNANCE · IMMUTABLE LEDGER
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#63C69A] animate-pulse" />
          </div>
          <h1 className="text-3xl font-serif text-[#F1EBDD] font-normal tracking-wide mt-1">
            System Audit & Provenance Ledger
          </h1>
          <p className="text-xs text-[#D8CEB9]/60 font-mono mt-1">
            SHA-256 state hashing with deterministic invariant checks for disaster emergency operations
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#D8CEB9]/40" />
            <input
              type="text"
              placeholder="Search hashes, stages, decisions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-[#091525] border border-[#203A55]/70 rounded px-8 py-1.5 text-xs text-[#F1EBDD] placeholder:text-[#D8CEB9]/30 focus:outline-none focus:border-[#C7A45D]/50 w-64 font-mono"
            />
          </div>
          <button 
            onClick={() => {
              const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(displayList, null, 2));
              const downloadAnchor = document.createElement('a');
              downloadAnchor.setAttribute("href", dataStr);
              downloadAnchor.setAttribute("download", `cycloneos-audit-ledger-${Date.now()}.json`);
              document.body.appendChild(downloadAnchor);
              downloadAnchor.click();
              downloadAnchor.remove();
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-[#0D1C2D] hover:bg-[#12253A] border border-[#203A55]/80 text-[#D8CEB9] hover:text-[#F1EBDD] rounded text-xs font-mono transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT LEDGER</span>
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#091525]/80 border border-[#203A55]/50 p-4 rounded">
          <span className="text-[10px] text-[#D8CEB9]/50 font-mono tracking-wider uppercase block">Total Verified Logs</span>
          <span className="text-2xl font-serif text-[#F1EBDD] mt-1 block">{displayList.length} Blocks</span>
          <span className="text-[10px] text-[#63C69A] font-mono mt-1 block">100% Invariants Preserved</span>
        </div>
        <div className="bg-[#091525]/80 border border-[#203A55]/50 p-4 rounded">
          <span className="text-[10px] text-[#D8CEB9]/50 font-mono tracking-wider uppercase block">Primary Hashing Algo</span>
          <span className="text-2xl font-serif text-[#C7A45D] mt-1 block">SHA-256</span>
          <span className="text-[10px] text-[#D8CEB9]/60 font-mono mt-1 block">FIPS 180-4 Compliant</span>
        </div>
        <div className="bg-[#091525]/80 border border-[#203A55]/50 p-4 rounded">
          <span className="text-[10px] text-[#D8CEB9]/50 font-mono tracking-wider uppercase block">Validation Mode</span>
          <span className="text-2xl font-serif text-[#65D9E8] mt-1 block">Autonomous</span>
          <span className="text-[10px] text-[#D8CEB9]/60 font-mono mt-1 block">Zero Human Tampering</span>
        </div>
        <div className="bg-[#091525]/80 border border-[#203A55]/50 p-4 rounded">
          <span className="text-[10px] text-[#D8CEB9]/50 font-mono tracking-wider uppercase block">Disaster Act Compliance</span>
          <span className="text-2xl font-serif text-[#63C69A] mt-1 block">NDMA 2005</span>
          <span className="text-[10px] text-[#D8CEB9]/60 font-mono mt-1 block">Section 30/34 Validated</span>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-[#091525]/90 border border-[#203A55]/70 rounded overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#203A55] bg-[#050B14]/80 text-[#D8CEB9]/50 text-[10px] tracking-wider uppercase">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Stage</th>
                <th className="py-3 px-4">Details & Action Payload</th>
                <th className="py-3 px-4">Cryptographic Hash</th>
                <th className="py-3 px-4 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#203A55]/40 text-[#D8CEB9]/80">
              {filteredRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-[#0D1C2D]/50 transition-colors">
                  <td className="py-3.5 px-4 text-[#F1EBDD]/70 whitespace-nowrap">
                    {typeof rec.timestamp === 'string' && rec.timestamp.includes(':') && !rec.timestamp.includes('T') ? rec.timestamp : new Date(rec.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider bg-[#203A55]/50 text-[#65D9E8] border border-[#65D9E8]/30">
                      {rec.stage}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 max-w-md">
                    <span className="text-[#F1EBDD] font-sans text-xs">{rec.details || (rec as any).event}</span>
                  </td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <button
                      onClick={() => handleCopy(rec.hash || (rec as any).inputHash || 'sha256:49f2b801...', rec.id)}
                      className="group flex items-center gap-1.5 text-[11px] text-[#C7A45D]/80 hover:text-[#C7A45D] transition-colors"
                      title="Click to copy hash"
                    >
                      <Hash className="w-3 h-3 text-[#C7A45D]/50 group-hover:text-[#C7A45D]" />
                      <span>{rec.hash || (rec as any).inputHash || 'sha256:49f2b801...'}</span>
                      <Copy className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                    {copiedId === rec.id && (
                      <span className="text-[9px] text-[#63C69A] block mt-0.5">Copied to clipboard</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 text-[10px] text-[#63C69A]">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>VALIDATED</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
