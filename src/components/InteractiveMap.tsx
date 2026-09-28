import React, { useState, useMemo } from 'react';
import { GoogleMapView } from './GoogleMapView';
import { GoogleEarthView } from './GoogleEarthView';
import { WindyMapView } from './WindyMapView';
import { GeminiIntelligenceModal } from './GeminiIntelligenceModal';
import { 
  InfrastructureAsset, 
  CycloneScenario, 
  TrackPoint 
} from '../types/cyclone';
import { 
  Building2, 
  Zap, 
  Home, 
  Navigation, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  AlertTriangle, 
  ArrowUpRight, 
  ShieldAlert, 
  Info, 
  Radio, 
  Compass,
  Globe,
  Wind,
  Sparkles
} from 'lucide-react';

interface InteractiveMapProps {
  scenario: CycloneScenario;
  assets: InfrastructureAsset[];
  selectedAsset: InfrastructureAsset | null;
  onSelectAsset: (asset: InfrastructureAsset | null) => void;
  timeOffset: number; // -6 to 0
  onCompileForAsset?: (asset: InfrastructureAsset) => void;
  onOpenDisclosure: () => void;
  initialMode?: 'google' | 'earth' | 'windy' | 'tactical';
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
  const [mapMode, setMapMode] = useState<'google' | 'earth' | 'windy' | 'tactical'>(initialMode);
  const [showGeminiBriefing, setShowGeminiBriefing] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoverCoord, setHoverCoord] = useState<{ lat: string; lon: string } | null>(null);

  // Map layer visibility toggles
  const [layers, setLayers] = useState({
    surgeInundation: true,
    rainfallRunoff: true,
    infrastructure: true,
    hospitals: true,
    substations: true,
    shelters: true,
    roads: true,
    stormTrack: true,
    dependencies: true
  });

  const [showLayerPanel, setShowLayerPanel] = useState(false);

  // Compute storm position based on timeOffset
  const currentTrackPoint: TrackPoint = useMemo(() => {
    const exact = scenario.trackPoints.find(p => p.timeOffsetHours === timeOffset);
    if (exact) return exact;
    return scenario.trackPoints[0];
  }, [scenario, timeOffset]);

  // Coordinate projection from (Lat, Lon) to SVG Canvas (1000 x 600)
  // Region bounds: Lat 21.35 to 21.90, Lon 87.30 to 87.85
  const project = (lat: number, lon: number) => {
    const minLat = 21.35;
    const maxLat = 21.90;
    const minLon = 87.30;
    const maxLon = 87.85;

    const x = ((lon - minLon) / (maxLon - minLon)) * 1000;
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * 600;
    return { x, y };
  };

  const unproject = (x: number, y: number) => {
    const minLat = 21.35;
    const maxLat = 21.90;
    const minLon = 87.30;
    const maxLon = 87.85;

    const lon = minLon + (x / 1000) * (maxLon - minLon);
    const lat = maxLat - (y / 600) * (maxLat - minLat);
    return {
      lat: `${lat.toFixed(4)}° N`,
      lon: `${lon.toFixed(4)}° E`
    };
  };

  // Convert current storm track to SVG points
  const stormSvgPos = useMemo(() => {
    return project(currentTrackPoint.lat, currentTrackPoint.lon);
  }, [currentTrackPoint]);

  // Mouse pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = ((e.clientX - rect.left - panOffset.x) / zoomLevel);
    const relY = ((e.clientY - rect.top - panOffset.y) / zoomLevel);
    setHoverCoord(unproject(relX, relY));

    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Filter visible assets based on layer toggles
  const visibleAssets = useMemo(() => {
    return assets.filter(asset => {
      if (!layers.infrastructure) return false;
      if (asset.type === 'hospital' && !layers.hospitals) return false;
      if (asset.type === 'substation' && !layers.substations) return false;
      if (asset.type === 'shelter' && !layers.shelters) return false;
      if (asset.type === 'road' && !layers.roads) return false;
      return true;
    });
  }, [assets, layers]);

  if (mapMode === 'google') {
    return (
      <>
        <GoogleMapView
          scenario={scenario}
          assets={assets}
          selectedAsset={selectedAsset}
          onSelectAsset={onSelectAsset}
          timeOffset={timeOffset}
          onCompileForAsset={onCompileForAsset}
          onOpenDisclosure={onOpenDisclosure}
          onSwitchToTactical={() => setMapMode('tactical')}
          onSwitchToGoogleEarth={() => setMapMode('earth')}
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
      </>
    );
  }

  if (mapMode === 'earth') {
    return (
      <>
        <GoogleEarthView
          scenario={scenario}
          assets={assets}
          selectedAsset={selectedAsset}
          onSelectAsset={onSelectAsset}
          timeOffset={timeOffset}
          onCompileForAsset={onCompileForAsset}
          onSwitchToGoogleMaps={() => setMapMode('google')}
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
      </>
    );
  }

  if (mapMode === 'windy') {
    return (
      <>
        <WindyMapView
          scenario={scenario}
          assets={assets}
          selectedAsset={selectedAsset}
          onSelectAsset={onSelectAsset}
          timeOffset={timeOffset}
          onSwitchToGoogleMaps={() => setMapMode('google')}
          onSwitchToGoogleEarth={() => setMapMode('earth')}
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
      </>
    );
  }

  return (
    <div 
      className="relative w-full h-full bg-[#050B14] overflow-hidden select-none cursor-grab active:cursor-grabbing border-r border-[#12253A]"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background cartographic grid */}
      <div className="absolute inset-0 carto-grid opacity-35 pointer-events-none" />
      <div className="absolute inset-0 film-grain opacity-20 pointer-events-none" />

      {/* SVG Map Canvas */}
      <svg
        viewBox="0 0 1000 600"
        className="w-full h-full transition-transform duration-100 ease-out"
        style={{
          transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          transformOrigin: '50% 50%'
        }}
      >
        <defs>
          {/* Oceanic Deep Water Gradient with subtle cyan luminescence */}
          <radialGradient id="oceanShade" cx="40%" cy="85%" r="80%">
            <stop offset="0%" stopColor="#0B1C2E" />
            <stop offset="50%" stopColor="#071524" />
            <stop offset="100%" stopColor="#040912" />
          </radialGradient>

          {/* Storm Surge Inundation Gradient with vivid maritime cyan glow */}
          <linearGradient id="surgeGradient" x1="0%" y1="100%" x2="40%" y2="20%">
            <stop offset="0%" stopColor="#65D9E8" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#2A92A6" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#12253A" stopOpacity="0.0" />
          </linearGradient>

          {/* High Danger Coastal Surge Zone */}
          <linearGradient id="criticalSurgeZone" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#D95757" stopOpacity="0.5" />
            <stop offset="60%" stopColor="#E7A84A" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#E7A84A" stopOpacity="0.0" />
          </linearGradient>

          {/* Rainfall Runoff Flow Texture */}
          <pattern id="runoffFlow" width="24" height="24" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="24" y2="24" stroke="#5A8CFF" strokeWidth="1" strokeDasharray="3,3" opacity="0.4" />
          </pattern>
        </defs>

        {/* Ocean Background */}
        <rect width="1000" height="600" fill="url(#oceanShade)" />

        {/* Faint nautical bathymetric curves */}
        <path d="M 0 550 Q 280 490 520 530 T 1000 570" stroke="#12253A" strokeWidth="1.2" fill="none" opacity="0.6" />
        <path d="M 0 470 Q 260 420 540 450 T 1000 500" stroke="#12253A" strokeWidth="1" fill="none" opacity="0.5" />
        <path d="M 0 390 Q 240 340 560 380 T 1000 430" stroke="#12253A" strokeWidth="0.8" fill="none" opacity="0.4" />

        {/* Nautical soundings */}
        <text x="140" y="530" fill="#6F8296" fontSize="8" fontFamily="JetBrains Mono" opacity="0.5">-28m SOUNDING</text>
        <text x="440" y="480" fill="#6F8296" fontSize="8" fontFamily="JetBrains Mono" opacity="0.5">-16m SHALLOW REEF</text>
        <text x="770" y="520" fill="#6F8296" fontSize="8" fontFamily="JetBrains Mono" opacity="0.5">-21m TRENCH</text>

        {/* Coastline Polygon (West Bengal Coastal Arc: Digha, Mandarmani, Shankarpur, Sagar Island reach) */}
        <g id="landmass">
          <path
            d="M -50 -50 
               L 1050 -50 
               L 1050 340 
               Q 920 310 820 330 
               Q 730 350 680 320 
               Q 620 290 560 300 
               Q 480 310 420 280 
               Q 350 250 280 270 
               Q 200 290 140 260 
               Q 80 230 -50 240 
               Z"
            fill="#091525"
            stroke="#1C3857"
            strokeWidth="1.8"
          />

          {/* Topographic Elevation Contours on Land */}
          <path d="M 0 180 Q 300 210 600 170 T 1000 210" stroke="#12253A" strokeWidth="1" fill="none" opacity="0.7" />
          <path d="M 0 120 Q 350 150 700 110 T 1000 140" stroke="#12253A" strokeWidth="0.9" fill="none" opacity="0.5" />
          <path d="M 0 60 Q 400 90 800 50 T 1000 70" stroke="#12253A" strokeWidth="0.8" fill="none" opacity="0.4" />
        </g>

        {/* LAYER: Storm Surge Inundation Polygon (Simulated Bathtub Inundation) */}
        {layers.surgeInundation && (
          <g id="stormSurgeLayer">
            {/* Outer Inundation Zone with vivid maritime cyan glow */}
            <path
              d="M -50 240 
                 Q 80 230 140 260 
                 Q 200 290 280 270 
                 Q 350 250 420 280 
                 Q 480 310 560 300 
                 Q 620 290 680 320 
                 Q 730 350 820 330 
                 Q 920 310 1050 340 
                 L 1050 230 
                 Q 880 200 750 210 
                 Q 630 190 520 200 
                 Q 400 180 320 200 
                 Q 200 170 80 190 
                 L -50 200 
                 Z"
              fill="url(#surgeGradient)"
              className="animate-surge"
            />

            {/* Critical Danger Breached Surge Zone (near Digha & Sluice Gates) */}
            <path
              d="M 120 260 
                 Q 220 280 320 250 
                 Q 400 270 480 260 
                 L 460 200 
                 Q 360 190 260 210 
                 Q 180 200 120 220 
                 Z"
              fill="url(#criticalSurgeZone)"
            />

            {/* Luminous Inundation crest line */}
            <path
              d="M -50 200 Q 80 190 200 170 Q 320 200 400 180 Q 520 200 630 190 Q 750 210 880 200 L 1050 230"
              stroke="#65D9E8"
              strokeWidth="2"
              strokeDasharray="5,2"
              fill="none"
              opacity="0.9"
            />
          </g>
        )}

        {/* LAYER: Rainfall Runoff Drainage Vectors */}
        {layers.rainfallRunoff && (
          <g id="runoffVectors" opacity="0.7">
            <path d="M 280 120 Q 290 180 320 250" stroke="#5A8CFF" strokeWidth="1.5" strokeDasharray="4,3" fill="none" />
            <path d="M 450 90 Q 440 170 420 270" stroke="#5A8CFF" strokeWidth="1.5" strokeDasharray="4,3" fill="none" />
            <path d="M 680 80 Q 660 180 640 290" stroke="#5A8CFF" strokeWidth="1.5" strokeDasharray="4,3" fill="none" />
            
            {/* Runoff drainage corridor text */}
            <text x="330" y="185" fill="#5A8CFF" fontSize="9" fontFamily="JetBrains Mono" fontWeight="600" opacity="0.9">
              ↓ TOPOGRAPHIC RUNOFF CONVERGENCE CORRIDOR
            </text>
          </g>
        )}

        {/* LAYER: Infrastructure Dependencies (Substation B powering Hospital A & Ward 4) */}
        {layers.dependencies && (
          <g id="dependencyNetwork">
            {/* Substation B (x: 420, y: 225) to Hospital A (x: 375, y: 245) */}
            <line
              x1="420"
              y1="225"
              x2="375"
              y2="245"
              stroke="#E2C98A"
              strokeWidth="2"
              strokeDasharray="5,4"
              opacity="0.9"
            />
            {/* Substation B to Ward 4 Shelter (x: 350, y: 260) */}
            <line
              x1="420"
              y1="225"
              x2="350"
              y2="260"
              stroke="#E2C98A"
              strokeWidth="1.5"
              strokeDasharray="4,3"
              opacity="0.75"
            />
          </g>
        )}

        {/* LAYER: Critical Arterial Road NH-116B */}
        {layers.roads && (
          <g id="arterialRoads">
            {/* Safe section from Contai to outskirts */}
            <path
              d="M 820 90 L 620 140 L 480 180"
              stroke="#63C69A"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
            {/* Critical flooded bottleneck section (NH-116B km 12-18) */}
            <path
              d="M 480 180 L 390 220 L 370 250"
              stroke="#D95757"
              strokeWidth="3.5"
              strokeDasharray="6,2"
              strokeLinecap="round"
              fill="none"
              opacity="0.95"
            />
            <text x="430" y="170" fill="#D95757" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
              NH-116B ARTERIAL [CUTOFF RISK 0.89]
            </text>
          </g>
        )}

        {/* LAYER: Cyclone Projected Track Cone & Storm Eye */}
        {layers.stormTrack && (
          <g id="cycloneTrack">
            {/* Projected Cone of Uncertainty with warm amber glow */}
            <path
              d={`M ${stormSvgPos.x} ${stormSvgPos.y} 
                  Q 420 380 480 280 
                  L 580 250 
                  Q 480 370 ${stormSvgPos.x + 40} ${stormSvgPos.y + 40} 
                  Z`}
              fill="#E7A84A"
              fillOpacity="0.14"
              stroke="#E7A84A"
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* Historical Track Line */}
            <path
              d="M 180 580 Q 280 500 360 420 T 460 280"
              stroke="#E7A84A"
              strokeWidth="2.2"
              strokeDasharray="6,4"
              fill="none"
              opacity="0.8"
            />

            {/* Animated Rotating Storm Eye */}
            <g transform={`translate(${stormSvgPos.x}, ${stormSvgPos.y})`}>
              {/* Radar Sweep Arc */}
              <circle
                r="70"
                fill="none"
                stroke="#65D9E8"
                strokeWidth="1"
                strokeDasharray="3,3"
                opacity="0.6"
              />
              <circle
                r="115"
                fill="none"
                stroke="#E7A84A"
                strokeWidth="0.75"
                strokeDasharray="5,5"
                opacity="0.45"
              />

              {/* Spiral Rainband SVG Curves */}
              <g className="animate-radar origin-center">
                <path d="M 0 0 Q 30 -30 60 -10 T 85 40" stroke="#65D9E8" strokeWidth="1.8" fill="none" opacity="0.7" />
                <path d="M 0 0 Q -30 30 -60 10 T -85 -40" stroke="#65D9E8" strokeWidth="1.8" fill="none" opacity="0.7" />
                <path d="M 0 0 Q 30 30 10 65 T -45 85" stroke="#E7A84A" strokeWidth="1.4" fill="none" opacity="0.6" />
                <path d="M 0 0 Q -30 -30 -10 -65 T 45 -85" stroke="#E7A84A" strokeWidth="1.4" fill="none" opacity="0.6" />
              </g>

              {/* Storm Eye Core */}
              <circle r="14" fill="#D95757" fillOpacity="0.35" />
              <circle r="7" fill="#D95757" />
              <circle r="3.5" fill="#F1EBDD" />

              {/* Category & Speed Label */}
              <text x="20" y="-12" fill="#F1EBDD" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                {scenario.category.split(' ')[0]} · {currentTrackPoint.windSpeedKmh} km/h
              </text>
              <text x="20" y="3" fill="#E7A84A" fontSize="8" fontFamily="JetBrains Mono" fontWeight="600">
                SURGE: {currentTrackPoint.surgeHeightM.toFixed(1)}m · {currentTrackPoint.centralPressureHpa} hPa
              </text>
            </g>
          </g>
        )}

        {/* LAYER: Infrastructure Nodes */}
        {visibleAssets.map(asset => {
          const { x, y } = project(asset.lat, asset.lon);
          const isSelected = selectedAsset?.id === asset.id;
          const isCritical = asset.criticality >= 0.9;
          const isHigh = asset.criticality >= 0.8 && asset.criticality < 0.9;

          const nodeColor = isCritical ? '#D95757' : isHigh ? '#E7A84A' : '#63C69A';

          return (
            <g
              key={asset.id}
              transform={`translate(${x}, ${y})`}
              className="cursor-pointer transition-all duration-200"
              onClick={(e) => {
                e.stopPropagation();
                onSelectAsset(asset);
              }}
            >
              {/* Exposure Radius Ring */}
              <circle
                r={asset.exposureScore * 30 + 12}
                fill={nodeColor}
                fillOpacity={isSelected ? 0.3 : 0.12}
                stroke={nodeColor}
                strokeWidth={isSelected ? 2.2 : 1.2}
                strokeDasharray={isSelected ? undefined : "3,3"}
                className={isCritical ? "animate-pulse" : ""}
              />

              {/* Base Marker Body */}
              <circle
                r="9"
                fill="#091525"
                stroke={isSelected ? "#E2C98A" : nodeColor}
                strokeWidth="2.2"
              />

              {/* Type Icon Glyph inside marker */}
              {asset.type === 'hospital' && (
                <path d="M -3 0 L 3 0 M 0 -3 L 0 3" stroke="#F1EBDD" strokeWidth="1.8" />
              )}
              {asset.type === 'substation' && (
                <path d="M 0 -3 L -2 0 L 1 0 L -1 3" stroke="#E2C98A" strokeWidth="1.4" fill="none" />
              )}
              {asset.type === 'shelter' && (
                <polygon points="0,-3 3,1 -3,1" fill="#65D9E8" />
              )}
              {asset.type === 'sluice_gate' && (
                <rect x="-2.5" y="-2.5" width="5" height="5" fill="#63C69A" />
              )}

              {/* Node Title on Map */}
              <text
                x="14"
                y="4"
                fill={isSelected ? "#E2C98A" : "#F1EBDD"}
                fontSize="9"
                fontFamily="JetBrains Mono"
                fontWeight={isSelected ? "bold" : "600"}
                className="drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]"
              >
                {asset.name}
              </text>
            </g>
          );
        })}

        {/* Cartographic Compass Rose in Upper Right */}
        <g transform="translate(930, 60)" opacity="0.75">
          <circle r="22" fill="none" stroke="#C7A45D" strokeWidth="1" />
          <polygon points="0,-18 4,-4 0,0 -4,-4" fill="#C7A45D" />
          <polygon points="0,18 4,4 0,0 -4,4" fill="#6F8296" />
          <polygon points="18,0 4,4 0,0 4,-4" fill="#6F8296" />
          <polygon points="-18,0 -4,4 0,0 -4,-4" fill="#6F8296" />
          <text x="-4" y="-22" fill="#C7A45D" fontSize="10" fontFamily="Cinzel" fontWeight="bold">N</text>
        </g>

        {/* Editorial Handwritten Calligraphic Annotations */}
        <g transform="translate(180, 310)" opacity="0.85">
          <text 
            x="0" 
            y="0" 
            fill="#E2C98A" 
            fontSize="18" 
            fontFamily="Parisienne, Cormorant Garamond, cursive"
          >
            surge pathway observed · Digha seawall breach zone
          </text>
          <path d="M 0 6 Q 90 18 160 8" stroke="#C7A45D" strokeWidth="1" fill="none" />
        </g>

        <g transform="translate(560, 240)" opacity="0.85">
          <text 
            x="0" 
            y="0" 
            fill="#E2C98A" 
            fontSize="17" 
            fontFamily="Parisienne, Cormorant Garamond, cursive"
          >
            inundation cut-off threshold · T−04:12
          </text>
        </g>

        {/* Coordinates in corner */}
        <text x="20" y="30" fill="#6F8296" fontSize="9" fontFamily="JetBrains Mono">
          BAY OF BENGAL · 21°37′N · 87°30′E · GEOSPATIAL MATRIX
        </text>
        <text x="20" y="580" fill="#6F8296" fontSize="8" fontFamily="JetBrains Mono">
          DATUM: WGS84 · SRTM 30m ELEVATION · SENTINEL-1 SAR PROJECTION
        </text>
      </svg>

      {/* Floating Map Controls & Overlays */}
      {/* Top Left: Active Scenario & Coordinate Banner */}
      <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
        <div className="bg-[#050B14]/90 backdrop-blur-md border border-[#12253A] px-3.5 py-1.5 rounded-sm shadow-xl">
          <div className="text-[10px] font-mono text-[#6F8296] tracking-wider uppercase">
            GEOSPATIAL INTELLIGENCE FIELD
          </div>
          <div className="text-xs font-mono font-semibold text-[#F1EBDD] flex items-center gap-2">
            <span>{scenario.region}</span>
            <span className="text-[#C7A45D]">·</span>
            <span className="text-[#65D9E8]">SRTM DEM 30m</span>
          </div>
        </div>

        {/* Live Hover Coordinates */}
        {hoverCoord && (
          <div className="bg-[#091525]/90 border border-[#12253A] px-2.5 py-1 rounded-sm text-[10px] font-mono text-[#E2C98A]">
            CURSOR: {hoverCoord.lat} · {hoverCoord.lon}
          </div>
        )}

        {/* Scientific Heuristic Disclosure Note */}
        <button
          onClick={onOpenDisclosure}
          className="pointer-events-auto flex items-center gap-1.5 bg-[#091525]/90 hover:bg-[#12253A] border border-[#12253A] px-2.5 py-1 rounded-sm text-[10px] font-mono text-[#E2C98A] transition-colors shadow-md"
        >
          <Info className="w-3 h-3 text-[#C7A45D]" />
          <span>MODEL NOTE: BATHTUB INUNDATION APPROXIMATION</span>
        </button>
      </div>

      {/* Top Right: Layer Toggle Bar & Zoom Controls */}
      <div className="absolute top-3 right-3 flex items-center gap-2">
        <button
          onClick={() => setMapMode('google')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#050B14]/90 border border-[#C7A45D]/60 text-[#C7A45D] hover:bg-[#C7A45D] hover:text-[#050B14] text-xs font-mono font-bold transition-colors shadow-lg"
          title="Switch to Google Maps Satellite"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>GOOGLE MAPS™</span>
        </button>

        <button
          onClick={() => setMapMode('earth')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#050B14]/90 border border-[#65D9E8]/60 text-[#65D9E8] hover:bg-[#65D9E8] hover:text-[#050B14] text-xs font-mono font-bold transition-colors shadow-lg"
          title="Switch to Google Earth 3D Orbital Elevation Model"
        >
          <Globe className="w-3.5 h-3.5" />
          <span>GOOGLE EARTH™ 3D</span>
        </button>

        <button
          onClick={() => setMapMode('windy')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#050B14]/90 border border-[#E7A84A]/60 text-[#E7A84A] hover:bg-[#E7A84A] hover:text-[#050B14] text-xs font-mono font-bold transition-colors shadow-lg"
          title="Switch to Windy.com Live Particle Streamlines"
        >
          <Wind className="w-3.5 h-3.5" />
          <span>WINDY.COM™</span>
        </button>

        <button
          onClick={() => setShowGeminiBriefing(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-sm bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] text-xs font-mono font-bold transition-colors shadow-lg animate-pulse"
          title="Synthesize multi-source hazard data with Gemini 3.8 Flash"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>GEMINI AI</span>
        </button>

        <button
          onClick={() => setShowLayerPanel(!showLayerPanel)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-mono transition-colors shadow-lg ${
            showLayerPanel 
              ? 'bg-[#C7A45D] text-[#050B14] border-[#E2C98A] font-bold' 
              : 'bg-[#091525]/90 text-[#F1EBDD] border-[#12253A] hover:border-[#65D9E8]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>LAYERS</span>
        </button>

        <div className="flex items-center bg-[#091525]/90 border border-[#12253A] rounded-sm shadow-lg">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
            className="p-1.5 text-[#9BB0C1] hover:text-[#F1EBDD] hover:bg-[#12253A] border-r border-[#12253A] transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 0.75))}
            className="p-1.5 text-[#9BB0C1] hover:text-[#F1EBDD] hover:bg-[#12253A] border-r border-[#12253A] transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            className="p-1.5 text-[#9BB0C1] hover:text-[#F1EBDD] hover:bg-[#12253A] transition-colors"
            title="Reset View"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Layer Toggles Dropdown Panel */}
      {showLayerPanel && (
        <div className="absolute top-12 right-3 w-64 bg-[#091525]/95 backdrop-blur-md border border-[#12253A] p-3.5 rounded-sm shadow-2xl z-20 space-y-2 select-none text-xs font-mono">
          <div className="text-[10px] text-[#6F8296] uppercase tracking-wider border-b border-[#12253A] pb-1 font-bold">
            CARTOGRAPHIC OVERLAYS
          </div>

          {[
            { key: 'surgeInundation', label: 'Surge Inundation (Bathtub)', color: '#65D9E8' },
            { key: 'rainfallRunoff', label: 'Rainfall Runoff Proxies', color: '#5A8CFF' },
            { key: 'stormTrack', label: 'Cyclone Track & Eye', color: '#E7A84A' },
            { key: 'roads', label: 'Arterial Highways (NH-116B)', color: '#D95757' },
            { key: 'dependencies', label: 'Grid/Hospital Dependency Rays', color: '#E2C98A' },
            { key: 'hospitals', label: 'Hospitals & Medical Units', color: '#D95757' },
            { key: 'substations', label: 'Power Substations', color: '#E2C98A' },
            { key: 'shelters', label: 'Evacuation Shelters', color: '#65D9E8' }
          ].map(layer => (
            <label key={layer.key} className="flex items-center justify-between cursor-pointer py-0.5 hover:text-[#F1EBDD]">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.color }} />
                <span>{layer.label}</span>
              </span>
              <input
                type="checkbox"
                checked={(layers as any)[layer.key]}
                onChange={(e) => setLayers({ ...layers, [layer.key]: e.target.checked })}
                className="accent-[#C7A45D] cursor-pointer"
              />
            </label>
          ))}
        </div>
      )}

      {/* Floating Detailed Asset Inspection Card */}
      {selectedAsset && (
        <div className="absolute bottom-4 left-4 max-w-sm bg-[#091525]/95 backdrop-blur-md border border-[#C7A45D]/60 p-4 rounded-sm shadow-2xl z-20 space-y-3 font-mono animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] tracking-wider text-[#C7A45D] uppercase font-bold">
                ASSET INTELLIGENCE · {selectedAsset.type.toUpperCase()}
              </div>
              <h3 className="text-sm font-bold text-[#F1EBDD]">
                {selectedAsset.name}
              </h3>
            </div>
            <button
              onClick={() => onSelectAsset(null)}
              className="text-[#6F8296] hover:text-[#F1EBDD] text-sm"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#050B14] p-2.5 rounded-xs border border-[#12253A]">
            <div>
              <span className="text-[#6F8296] text-[10px]">CRITICALITY</span>
              <div className="font-bold text-[#D95757]">{selectedAsset.criticality.toFixed(2)} / 1.0</div>
            </div>
            <div>
              <span className="text-[#6F8296] text-[10px]">EXPOSURE INDEX</span>
              <div className="font-bold text-[#E7A84A]">{selectedAsset.exposureScore.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-[#6F8296] text-[10px]">SURGE ETA</span>
              <div className="font-bold text-[#65D9E8]">0{selectedAsset.surgeEtaHours.toFixed(1)}:00 HRS</div>
            </div>
            <div>
              <span className="text-[#6F8296] text-[10px]">ELEVATION</span>
              <div className="text-[#F1EBDD]">+{selectedAsset.elevationM}m MSL</div>
            </div>
          </div>

          {selectedAsset.accessRoad && (
            <div className="text-[10px] text-[#9BB0C1]">
              <span className="text-[#6F8296]">ACCESS CORRIDOR: </span>
              <span className="text-[#D95757] font-semibold">{selectedAsset.accessRoad}</span>
            </div>
          )}

          {selectedAsset.backupPower && (
            <div className="text-[10px] text-[#9BB0C1]">
              <span className="text-[#6F8296]">POWER DEPENDENCY: </span>
              <span className="text-[#E2C98A] font-semibold">{selectedAsset.backupPower}</span>
            </div>
          )}

          <div className="text-[10px] text-[#6F8296] leading-relaxed border-t border-[#12253A] pt-2">
            {selectedAsset.details.vulnerabilityNote}
          </div>

          {onCompileForAsset && (
            <button
              onClick={() => onCompileForAsset(selectedAsset)}
              className="w-full flex items-center justify-center gap-2 py-1.5 bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] text-xs font-bold rounded-xs tracking-wider transition-colors shadow-md"
            >
              <span>VIEW DECISION DIRECTIVE</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Bottom Right Cartographic Legend */}
      <div className="absolute bottom-3 right-3 bg-[#050B14]/90 backdrop-blur-md border border-[#12253A] px-3 py-2 rounded-sm text-[10px] font-mono space-y-1.5 shadow-xl">
        <div className="text-[#6F8296] tracking-wider uppercase font-semibold text-[9px]">
          RISK CLASSIFICATION
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D95757]" />
            <span className="text-[#9BB0C1]">Critical (&gt;0.85)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E7A84A]" />
            <span className="text-[#9BB0C1]">High (0.7-0.85)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#63C69A]" />
            <span className="text-[#9BB0C1]">Controlled (&lt;0.5)</span>
          </span>
        </div>
      </div>

      {/* Gemini Intelligence Briefing Modal */}
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
