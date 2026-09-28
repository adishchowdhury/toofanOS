import React, { useState } from 'react';
import { 
  Building2, 
  Zap, 
  Home, 
  Navigation, 
  Search, 
  Filter, 
  ArrowRight, 
  Layers, 
  AlertTriangle,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { InfrastructureAsset, AssetType } from '../types/cyclone';

interface InfrastructureIntelligenceViewProps {
  assets: InfrastructureAsset[];
  onSelectAssetOnMap: (asset: InfrastructureAsset) => void;
}

export const InfrastructureIntelligenceView: React.FC<InfrastructureIntelligenceViewProps> = ({
  assets,
  onSelectAssetOnMap
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | AssetType>('all');
  const [selectedAssetDetail, setSelectedAssetDetail] = useState<InfrastructureAsset | null>(assets[0]);

  const filteredAssets = assets.filter(asset => {
    if (typeFilter !== 'all' && asset.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.details.address.toLowerCase().includes(q) ||
        asset.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="flex-1 bg-[#050B14] p-4 lg:p-8 overflow-y-auto select-none space-y-6 font-mono">
      {/* Header */}
      <div className="border-b border-[#12253A] pb-5">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[10px] tracking-widest text-[#E7A84A] uppercase font-bold px-2 py-0.5 border border-[#E7A84A]/40 rounded-xs bg-[#E7A84A]/10">
            SPATIAL EXPOSURE INVENTORY
          </span>
          <span className="text-[11px] text-[#6F8296]">
            OPENSTREETMAP OVERPASS GRAPH · {assets.length} CRITICAL NODES
          </span>
          <span className="text-xs text-[#E2C98A] font-script">
            "mapping the life-lines"
          </span>
        </div>

        <h1 className="text-3xl lg:text-4xl font-serif font-bold text-[#F1EBDD] tracking-tight">
          INFRASTRUCTURE INTELLIGENCE
        </h1>
        <p className="text-sm text-[#9BB0C1] mt-1">
          Multimodal dependency graph mapping power, transit, and medical casualty corridors.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#091525]/90 border border-[#12253A] p-3 rounded-sm shadow-lg">
        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-[#6F8296] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hospitals, substations, shelters..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#050B14] border border-[#12253A] rounded-xs text-xs text-[#F1EBDD] placeholder-[#6F8296] focus:outline-none focus:border-[#C7A45D]"
          />
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap w-full sm:w-auto text-xs">
          {[
            { id: 'all', label: 'ALL ASSETS' },
            { id: 'hospital', label: 'HOSPITALS' },
            { id: 'substation', label: 'SUBSTATIONS' },
            { id: 'shelter', label: 'SHELTERS' },
            { id: 'road', label: 'HIGHWAYS' }
          ].map(btn => (
            <button
              key={btn.id}
              onClick={() => setTypeFilter(btn.id as any)}
              className={`px-3 py-1 rounded-xs transition-colors ${
                typeFilter === btn.id
                  ? 'bg-[#C7A45D] text-[#050B14] font-bold'
                  : 'bg-[#050B14] text-[#9BB0C1] hover:text-[#F1EBDD] border border-[#12253A]'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Asset Explorer + Deep Dependency Graph View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Asset List (2 Cols on lg) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="text-[10px] text-[#6F8296] uppercase tracking-wider font-bold">
            SHOWING {filteredAssets.length} CRITICAL INFRASTRUCTURE TARGETS
          </div>

          <div className="space-y-2.5">
            {filteredAssets.map(asset => {
              const isSelected = selectedAssetDetail?.id === asset.id;
              const isCritical = asset.criticality >= 0.9;

              return (
                <div
                  key={asset.id}
                  onClick={() => setSelectedAssetDetail(asset)}
                  className={`p-3.5 rounded-sm border transition-all cursor-pointer shadow-md ${
                    isSelected
                      ? 'bg-[#0D1C2D] border-[#C7A45D] shadow-[inset_0_0_15px_rgba(199,164,93,0.15)]'
                      : 'bg-[#091525]/80 border-[#12253A] hover:border-[#65D9E8]/60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5">
                      {asset.type === 'hospital' && <Building2 className="w-4 h-4 text-[#D95757]" />}
                      {asset.type === 'substation' && <Zap className="w-4 h-4 text-[#E2C98A]" />}
                      {asset.type === 'shelter' && <Home className="w-4 h-4 text-[#65D9E8]" />}
                      {asset.type === 'road' && <Navigation className="w-4 h-4 text-[#E7A84A]" />}
                      <div>
                        <h4 className="text-xs font-bold text-[#F1EBDD]">{asset.name}</h4>
                        <div className="text-[10px] text-[#6F8296]">{asset.details.address}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-xs font-bold ${
                        isCritical
                          ? 'bg-[#D95757]/20 text-[#D95757] border border-[#D95757]/40'
                          : 'bg-[#E7A84A]/20 text-[#E7A84A] border border-[#E7A84A]/40'
                      }`}>
                        CRIT: {asset.criticality.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-[#65D9E8] font-bold">
                        EXP: {asset.exposureScore.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] bg-[#050B14] p-2.5 rounded-xs border border-[#12253A] mb-2 shadow-inner">
                    <div>
                      <span className="text-[#6F8296] block">SURGE ETA</span>
                      <span className="text-[#F1EBDD] font-bold">0{asset.surgeEtaHours.toFixed(1)}:00 HRS</span>
                    </div>
                    <div>
                      <span className="text-[#6F8296] block">ELEVATION</span>
                      <span className="text-[#F1EBDD] font-bold">+{asset.elevationM}m MSL</span>
                    </div>
                    <div>
                      <span className="text-[#6F8296] block">STATUS</span>
                      <span className="text-[#E7A84A] font-bold uppercase">{asset.status}</span>
                    </div>
                  </div>

                  <div className="text-[10px] text-[#9BB0C1] line-clamp-2">
                    {asset.details.vulnerabilityNote}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Selected Asset Deep Inspector & Dependency Tree */}
        <div>
          {selectedAssetDetail ? (
            <div className="bg-[#091525] border border-[#C7A45D] p-5 rounded-sm space-y-4 sticky top-4 shadow-2xl">
              <div className="border-b border-[#12253A] pb-3">
                <div className="text-[10px] text-[#C7A45D] uppercase font-bold tracking-wider">
                  NODE DEPENDENCY DOSSIER
                </div>
                <h3 className="text-base font-bold text-[#F1EBDD] mt-0.5">
                  {selectedAssetDetail.name}
                </h3>
                <div className="text-xs text-[#6F8296]">{selectedAssetDetail.details.address}</div>
              </div>

              {/* Cascade Dependencies Graph */}
              <div className="space-y-3 text-xs">
                <div className="text-[10px] text-[#65D9E8] uppercase font-bold tracking-wider">
                  DEPENDENCY CASUALTY CHAIN
                </div>

                {selectedAssetDetail.serves && selectedAssetDetail.serves.length > 0 && (
                  <div className="p-3 bg-[#050B14] rounded-xs border border-[#12253A] space-y-1.5 shadow-inner">
                    <span className="text-[10px] text-[#6F8296] block uppercase">DOWNSTREAM DEPENDENTS:</span>
                    <ul className="space-y-1 text-[11px] text-[#F1EBDD]">
                      {selectedAssetDetail.serves.map(srv => (
                        <li key={srv} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E2C98A]" />
                          <span>{srv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedAssetDetail.backupPower && (
                  <div className="p-3 bg-[#050B14] rounded-xs border border-[#12253A] space-y-1 shadow-inner">
                    <span className="text-[10px] text-[#6F8296] block uppercase">UPSTREAM POWER GRID FEEDER:</span>
                    <div className="text-xs text-[#E2C98A] font-bold">
                      {selectedAssetDetail.backupPower}
                    </div>
                  </div>
                )}

                {selectedAssetDetail.accessRoad && (
                  <div className="p-3 bg-[#050B14] rounded-xs border border-[#12253A] space-y-1 shadow-inner">
                    <span className="text-[10px] text-[#6F8296] block uppercase">PRIMARY INGRESS / EGRESS ARTERIAL:</span>
                    <div className="text-xs text-[#D95757] font-bold">
                      {selectedAssetDetail.accessRoad}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-[#050B14] rounded-xs border border-[#12253A] space-y-1 shadow-inner">
                  <span className="text-[10px] text-[#6F8296] block uppercase">SECONDARY CASCADE HAZARD:</span>
                  <div className="text-[11px] text-[#E7A84A] leading-relaxed">
                    {selectedAssetDetail.details.secondaryHazard}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#12253A] flex items-center justify-between text-[11px]">
                  <span className="text-[#6F8296]">CONTACT OFFICER:</span>
                  <span className="text-[#F1EBDD] font-semibold">{selectedAssetDetail.details.contactOfficer}</span>
                </div>
              </div>

              <button
                onClick={() => onSelectAssetOnMap(selectedAssetDetail)}
                className="w-full py-2.5 bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] text-xs font-bold rounded-xs tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-lg"
              >
                <span>LOCATE ON OPERATIONAL MAP</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="p-8 text-center text-[#6F8296] text-xs">
              Select an asset to view dependency connections.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
