import React, { useState } from 'react';
import { GoogleMapView } from './GoogleMapView';
import { WindyMapView } from './WindyMapView';
import { GeminiIntelligenceModal } from './GeminiIntelligenceModal';
import { 
  InfrastructureAsset, 
  CycloneScenario 
} from '../types/cyclone';

interface InteractiveMapProps {
  scenario: CycloneScenario;
  assets: InfrastructureAsset[];
  selectedAsset: InfrastructureAsset | null;
  onSelectAsset: (asset: InfrastructureAsset | null) => void;
  timeOffset: number; // -6 to 0
  onCompileForAsset?: (asset: InfrastructureAsset) => void;
  onOpenDisclosure: () => void;
  initialMode?: 'google' | 'windy' | 'earth' | 'tactical';
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  scenario,
  assets,
  selectedAsset,
  onSelectAsset,
  timeOffset,
  onCompileForAsset,
  onOpenDisclosure,
  initialMode = 'google'
}) => {
  const [mapMode, setMapMode] = useState<'google' | 'windy'>(initialMode === 'windy' ? 'windy' : 'google');
  const [showGeminiBriefing, setShowGeminiBriefing] = useState(false);

  if (mapMode === 'windy') {
    return (
      <div className="relative w-full h-full bg-[#050B14] overflow-hidden select-none">
        <WindyMapView
          scenario={scenario}
          assets={assets}
          selectedAsset={selectedAsset}
          onSelectAsset={onSelectAsset}
          timeOffset={timeOffset}
          onSwitchToGoogleMaps={() => setMapMode('google')}
          onOpenGeminiBriefing={() => setShowGeminiBriefing(true)}
        />
        <GeminiIntelligenceModal
          isOpen={showGeminiBriefing}
          onClose={() => setShowGeminiBriefing(false)}
          scenario={scenario}
          assets={assets}
          timeOffset={timeOffset}
          onCompileDecisions={() => onCompileForAsset && onCompileForAsset(assets[0])}
          onDispatchAll={() => onCompileForAsset && onCompileForAsset(assets[0])}
        />
      </div>
    );
  }

  // Smooth Google Maps Primary View
  return (
    <div className="relative w-full h-full bg-[#050B14] overflow-hidden select-none">
      <GoogleMapView
        scenario={scenario}
        assets={assets}
        selectedAsset={selectedAsset}
        onSelectAsset={onSelectAsset}
        timeOffset={timeOffset}
        onCompileForAsset={onCompileForAsset}
        onOpenDisclosure={onOpenDisclosure}
        onSwitchToWindy={() => setMapMode('windy')}
        onOpenGeminiBriefing={() => setShowGeminiBriefing(true)}
      />
      <GeminiIntelligenceModal
        isOpen={showGeminiBriefing}
        onClose={() => setShowGeminiBriefing(false)}
        scenario={scenario}
        assets={assets}
        timeOffset={timeOffset}
        onCompileDecisions={() => onCompileForAsset && onCompileForAsset(assets[0])}
        onDispatchAll={() => onCompileForAsset && onCompileForAsset(assets[0])}
      />
    </div>
  );
};
