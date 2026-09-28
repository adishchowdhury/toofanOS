import React, { useState, useEffect, useRef } from 'react';
import { CycloneScenario, InfrastructureAsset } from '../types/cyclone';
import { 
  Globe, 
  Layers, 
  Mountain, 
  Compass, 
  Eye, 
  Radio, 
  Wind, 
  Waves, 
  Maximize2, 
  Sparkles, 
  ExternalLink,
  ShieldAlert,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Building2,
  Home,
  Navigation,
  ArrowUpRight
} from 'lucide-react';

interface GoogleEarthViewProps {
  scenario: CycloneScenario;
  assets: InfrastructureAsset[];
  selectedAsset: InfrastructureAsset | null;
  onSelectAsset: (asset: InfrastructureAsset | null) => void;
  timeOffset: number;
  onSwitchToGoogleMaps: () => void;
  onSwitchToWindy: () => void;
  onOpenGeminiBriefing: () => void;
  onCompileForAsset?: (asset: InfrastructureAsset) => void;
}

export const GoogleEarthView: React.FC<GoogleEarthViewProps> = ({
  scenario,
  assets,
  selectedAsset,
  onSelectAsset,
  timeOffset,
  onSwitchToGoogleMaps,
  onSwitchToWindy,
  onOpenGeminiBriefing,
  onCompileForAsset
}) => {
  // 3D Camera State
  const [pitch, setPitch] = useState<number>(55); // 0 (nadir) to 75 (oblique)
  const [heading, setHeading] = useState<number>(315); // degrees
  const [altitudeKm, setAltitudeKm] = useState<number>(3.5); // km
  const [isOrbiting, setIsOrbiting] = useState<boolean>(true);
  const [elevationExaggeration, setElevationExaggeration] = useState<number>(2.5);
  const [showSurgePlane, setShowSurgePlane] = useState<boolean>(true);
  const [show3DPillars, setShow3DPillars] = useState<boolean>(true);
  const [earthMode, setEarthMode] = useState<'3d-elevation-dem' | 'google-earth-web'>('3d-elevation-dem');

  const activeTrackPoint = scenario.trackPoints.find(p => p.timeOffsetHours === timeOffset) || scenario.trackPoints[0];
  const surgeHeightM = 2.42;

  // Auto-orbit animation loop
  useEffect(() => {
    if (!isOrbiting || earthMode === 'google-earth-web') return;
    const interval = setInterval(() => {
      setHeading(prev => (prev + 0.3) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, [isOrbiting, earthMode]);

  // Camera presets
  const applyPreset = (preset: 'eyewall' | 'coastal-cut' | 'orbital' | 'hospital') => {
    setIsOrbiting(false);
    if (preset === 'eyewall') {
      setPitch(65);
      setHeading(340);
      setAltitudeKm(1.8);
    } else if (preset === 'coastal-cut') {
      setPitch(45);
      setHeading(270);
      setAltitudeKm(4.2);
    } else if (preset === 'orbital') {
      setPitch(50);
      setAltitudeKm(5.0);
      setIsOrbiting(true);
    } else if (preset === 'hospital') {
      setPitch(60);
      setHeading(15);
      setAltitudeKm(1.2);
    }
  };

  // Google Earth Web Deep Link
  const googleEarthWebUrl = `https://earth.google.com/web/@${activeTrackPoint.lat},${activeTrackPoint.lon},${altitudeKm * 1000}a,35d,${heading}y,${pitch}t,0r`;

  return (
    <div className="relative w-full h-full bg-[#03070E] overflow-hidden select-none flex flex-col font-mono text-[#F1EBDD]">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Badge: Google Earth 3D Engine */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#050B14]/95 backdrop-blur-md border border-[#203A55] px-3 py-1.5 rounded shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#65D9E8] animate-pulse" />
            <span className="text-[11px] font-mono font-bold text-[#F1EBDD] uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-[#65D9E8]" />
              <span>GOOGLE EARTH™ 3D ELEVATION</span>
            </span>
          </div>
          <span className="text-[#203A55]">|</span>
          <span className="text-[11px] font-serif text-[#C7A45D]">
            DEM Digital Terrain · {scenario.name}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#65D9E8]/20 text-[#65D9E8] border border-[#65D9E8]/40 font-semibold">
            MSL +{surgeHeightM}m SURGE
          </span>
        </div>

        {/* Center / Right: 3D Camera Controls & Engine Jump */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          {/* Mode Switcher: 3D DEM vs Google Earth Web */}
          <div className="flex items-center bg-[#050B14]/95 backdrop-blur-md border border-[#203A55] rounded p-0.5">
            <button
              onClick={() => setEarthMode('3d-elevation-dem')}
              className={`px-2.5 py-1 text-[10px] font-mono rounded transition-colors ${
                earthMode === '3d-elevation-dem'
                  ? 'bg-[#65D9E8] text-[#050B14] font-bold shadow'
                  : 'text-[#D8CEB9] hover:text-[#F1EBDD]'
              }`}
            >
              3D TERRAIN DEM
            </button>
            <button
              onClick={() => setEarthMode('google-earth-web')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono rounded transition-colors ${
                earthMode === 'google-earth-web'
                  ? 'bg-[#65D9E8] text-[#050B14] font-bold shadow'
                  : 'text-[#D8CEB9] hover:text-[#F1EBDD]'
              }`}
            >
              <span>EARTH WEB LAUNCH</span>
              <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* 3D Presets */}
          <div className="hidden md:flex items-center bg-[#050B14]/95 backdrop-blur-md border border-[#203A55] rounded p-0.5">
            <button
              onClick={() => applyPreset('orbital')}
              className={`px-2 py-1 text-[10px] font-mono rounded transition-colors flex items-center gap-1 ${
                isOrbiting ? 'bg-[#C7A45D] text-[#050B14] font-bold' : 'text-[#D8CEB9] hover:text-[#F1EBDD]'
              }`}
              title="Continuous 360° orbital survey"
            >
              {isOrbiting ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
              <span>ORBIT</span>
            </button>
            <button
              onClick={() => applyPreset('eyewall')}
              className="px-2 py-1 text-[10px] font-mono text-[#D8CEB9] hover:text-[#65D9E8] rounded transition-colors"
            >
              EYEWALL
            </button>
            <button
              onClick={() => applyPreset('coastal-cut')}
              className="px-2 py-1 text-[10px] font-mono text-[#D8CEB9] hover:text-[#C7A45D] rounded transition-colors"
            >
              COASTAL CUT
            </button>
            <button
              onClick={() => applyPreset('hospital')}
              className="px-2 py-1 text-[10px] font-mono text-[#D8CEB9] hover:text-[#D95757] rounded transition-colors"
            >
              HOSPITAL 3D
            </button>
          </div>

          {/* Switch to Windy.com */}
          <button
            onClick={onSwitchToWindy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091525]/90 hover:bg-[#0D1C2D] border border-[#E7A84A]/40 hover:border-[#E7A84A] text-[#E7A84A] rounded text-[10px] font-mono font-bold tracking-wider transition-colors shadow-lg"
            title="Switch to Windy.com Live Particle Radar"
          >
            <Wind className="w-3.5 h-3.5" />
            <span>WINDY.COM™</span>
          </button>

          {/* Switch to Google Maps */}
          <button
            onClick={onSwitchToGoogleMaps}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091525]/90 hover:bg-[#0D1C2D] border border-[#C7A45D]/40 hover:border-[#C7A45D] text-[#C7A45D] rounded text-[10px] font-mono font-bold tracking-wider transition-colors shadow-lg"
            title="Switch to Google Maps Satellite View"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>GOOGLE MAPS™</span>
          </button>

          {/* Gemini AI Briefing Trigger */}
          <button
            onClick={onOpenGeminiBriefing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] rounded text-[10px] font-mono font-bold tracking-wider transition-colors shadow-lg animate-pulse"
            title="Synthesize Earth elevation with Gemini 3.8 Flash"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>GEMINI AI SYNTHESIS</span>
          </button>
        </div>
      </div>

      {/* Main View Area */}
      {earthMode === 'google-earth-web' ? (
        <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-[#050B14] relative">
          <div className="max-w-xl text-center space-y-4 bg-[#091525]/90 border border-[#203A55] p-8 rounded-xl shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 rounded-full bg-[#65D9E8]/10 border border-[#65D9E8]/40 flex items-center justify-center mx-auto text-[#65D9E8]">
              <Globe className="w-8 h-8 animate-spin" style={{ animationDuration: '16s' }} />
            </div>
            <h2 className="text-xl font-serif text-[#F1EBDD]">
              Google Earth™ 3D Planetary Simulation
            </h2>
            <p className="text-xs text-[#D8CEB9]/70 leading-relaxed font-sans">
              Connect directly to Google Earth's Photorealistic 3D Globe centered at coordinates{' '}
              <span className="font-mono text-[#65D9E8]">{activeTrackPoint.lat.toFixed(2)}°N, {activeTrackPoint.lon.toFixed(2)}°E</span>.
              Explore 3D bathymetry of the Bay of Bengal, atmospheric cyclone eyewall structure, and high-resolution coastal elevation models.
            </p>

            <div className="flex items-center justify-center gap-3 pt-2">
              <a
                href={googleEarthWebUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#65D9E8] hover:bg-[#97E7F1] text-[#050B14] font-bold text-xs rounded transition-colors shadow-lg"
              >
                <span>LAUNCH IN GOOGLE EARTH WEB</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={() => setEarthMode('3d-elevation-dem')}
                className="px-4 py-2.5 bg-[#0D1C2D] hover:bg-[#12253A] text-[#D8CEB9] border border-[#203A55] text-xs rounded transition-colors"
              >
                RETURN TO 3D DEM CANVASES
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Interactive 3D Perspective Digital Elevation Model (DEM) Canvas */
        <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
          {/* SVG 3D Perspective Viewport */}
          <svg 
            className="w-full h-full cursor-grab active:cursor-grabbing" 
            viewBox="0 0 1000 650"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Deep Oceanic Depth Gradient */}
              <radialGradient id="earthGlobeGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#0E2843" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#08182B" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#03070E" stopOpacity="0.95" />
              </radialGradient>

              {/* Storm Surge Inundation Water Plane */}
              <linearGradient id="surgeWaterPlane" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#65D9E8" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#203A55" stopOpacity="0.15" />
              </linearGradient>

              {/* Cyclone Vortex Funnel */}
              <radialGradient id="cycloneEyeCone" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#050B14" stopOpacity="0.9" />
                <stop offset="25%" stopColor="#D95757" stopOpacity="0.8" />
                <stop offset="60%" stopColor="#E7A84A" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#65D9E8" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Earth Surface Horizon & Curvature */}
            <rect width="1000" height="650" fill="#03070E" />
            <circle cx="500" cy="850" r="650" fill="url(#earthGlobeGlow)" />

            {/* 3D Topographic Contour Meshes (Elevation DEM) */}
            <g transform={`rotate(${heading - 315}, 500, 360)`} style={{ transition: 'transform 0.05s linear' }}>
              {/* Bay of Bengal Sea Level (MSL = 0.0m) */}
              <path
                d="M 150 480 Q 350 420, 500 450 T 850 480 L 880 620 L 120 620 Z"
                fill="#0A1E33"
                opacity="0.7"
              />

              {/* 3D Storm Surge Inundation Plane (+2.42m MSL) */}
              {showSurgePlane && (
                <g className="animate-pulse" style={{ animationDuration: '3s' }}>
                  <polygon
                    points="200,430 800,430 860,520 140,520"
                    fill="url(#surgeWaterPlane)"
                    stroke="#65D9E8"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  <text x="210" y="425" fill="#65D9E8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="bold">
                    ▲ STORM SURGE FLOOD LEVEL: +2.42m MSL
                  </text>
                </g>
              )}

              {/* Coastal Topography Contours (+1m to +5m MSL) */}
              <path
                d="M 180 430 Q 320 370, 500 390 T 820 410"
                fill="none"
                stroke="#1B3A57"
                strokeWidth="2"
              />
              <path
                d="M 210 390 Q 350 330, 520 350 T 790 370"
                fill="none"
                stroke="#294B6D"
                strokeWidth="2"
              />
              <path
                d="M 240 350 Q 380 290, 540 310 T 760 330"
                fill="none"
                stroke="#375D84"
                strokeWidth="2.5"
              />

              {/* 3D Cyclone Eyewall Vortex Cloud Funnel */}
              <g transform="translate(620, 260)">
                <ellipse cx="0" cy="0" rx="140" ry="60" fill="url(#cycloneEyeCone)" />
                <ellipse cx="0" cy="0" rx="70" ry="30" fill="none" stroke="#D95757" strokeWidth="2" strokeDasharray="6 3" />
                <ellipse cx="0" cy="0" rx="25" ry="12" fill="#050B14" stroke="#D95757" strokeWidth="3" />
                <circle cx="0" cy="0" r="4" fill="#F1EBDD" />
                
                {/* 3D Eyewall Cloud Tower Height Vector */}
                <line x1="0" y1="0" x2="0" y2="-120" stroke="#D95757" strokeWidth="2" strokeDasharray="3 3" />
                <circle cx="0" cy="-120" r="3" fill="#D95757" />
                <text x="8" y="-115" fill="#D95757" fontSize="9" fontFamily="JetBrains Mono" fontWeight="bold">
                  TROPOPAUSE EYEWALL: 14,200m
                </text>
              </g>

              {/* 3D Infrastructure Elevation Pillars */}
              {show3DPillars && assets.map((asset, index) => {
                // Approximate 3D projection positions for key coastal assets
                const assetPositions: Record<string, { x: number; y: number; elevationM: number }> = {
                  'hosp-1': { x: 380, y: 380, elevationM: 4.5 },
                  'sub-1': { x: 490, y: 440, elevationM: 1.8 },
                  'sub-2': { x: 310, y: 360, elevationM: 6.2 },
                  'shelter-1': { x: 440, y: 410, elevationM: 5.2 },
                  'shelter-2': { x: 570, y: 430, elevationM: 3.8 },
                  'road-1': { x: 420, y: 450, elevationM: 1.1 }
                };

                const pos = assetPositions[asset.id] || { 
                  x: 300 + (index * 70), 
                  y: 400 + (index * 15), 
                  elevationM: asset.elevationM 
                };

                const isBreached = pos.elevationM < surgeHeightM;
                const pillarHeight = pos.elevationM * 14 * (elevationExaggeration / 2);
                const isSelected = selectedAsset?.id === asset.id;

                return (
                  <g 
                    key={asset.id} 
                    transform={`translate(${pos.x}, ${pos.y})`}
                    className="cursor-pointer group"
                    onClick={() => onSelectAsset(asset)}
                  >
                    {/* Vertical Elevation Pillar (Z-Axis) */}
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2={-pillarHeight}
                      stroke={isBreached ? '#D95757' : '#63C69A'}
                      strokeWidth={isSelected ? 4 : 2.5}
                    />

                    {/* Ground Footprint Base */}
                    <ellipse
                      cx="0"
                      cy="0"
                      rx="8"
                      ry="4"
                      fill={isBreached ? '#D95757' : '#203A55'}
                      opacity="0.6"
                    />

                    {/* Elevated Asset Head Pin */}
                    <g transform={`translate(0, ${-pillarHeight})`}>
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 9 : 6}
                        fill={isBreached ? '#D95757' : '#63C69A'}
                        stroke="#F1EBDD"
                        strokeWidth="1.5"
                      />
                      {isBreached && (
                        <circle
                          cx="0"
                          cy="0"
                          r="12"
                          fill="none"
                          stroke="#D95757"
                          strokeWidth="1.5"
                          className="animate-ping"
                          opacity="0.6"
                        />
                      )}
                      
                      {/* Elevation Label */}
                      <rect
                        x="10"
                        y="-10"
                        width="110"
                        height="20"
                        fill="#050B14"
                        stroke={isBreached ? '#D95757' : '#203A55'}
                        strokeWidth="1"
                        rx="2"
                        opacity="0.9"
                      />
                      <text
                        x="15"
                        y="4"
                        fill={isBreached ? '#D95757' : '#F1EBDD'}
                        fontSize="8.5"
                        fontFamily="JetBrains Mono"
                        fontWeight="bold"
                      >
                        +{pos.elevationM}m MSL {isBreached ? '⚠️ BREACH' : '✓ SAFE'}
                      </text>
                    </g>
                  </g>
                );
              })}
            </g>

            {/* Compass Rose in 3D Perspective */}
            <g transform="translate(80, 560)">
              <circle cx="0" cy="0" r="32" fill="#050B14" stroke="#203A55" strokeWidth="1.5" opacity="0.85" />
              <line x1="0" y1="-26" x2="0" y2="26" stroke="#C7A45D" strokeWidth="1.5" />
              <line x1="-26" y1="0" x2="26" y2="0" stroke="#203A55" strokeWidth="1" />
              <polygon points="0,-26 5,-8 -5,-8" fill="#D95757" />
              <polygon points="0,26 5,8 -5,8" fill="#F1EBDD" />
              <text x="0" y="-30" fill="#D95757" fontSize="9" fontWeight="bold" textAnchor="middle">N</text>
              <text x="0" y="40" fill="#C7A45D" fontSize="8" textAnchor="middle">{heading.toFixed(0)}°</text>
            </g>
          </svg>

          {/* Bottom Elevation Cross-Section Bar */}
          <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
            {/* Topographic Slicing Readout */}
            <div className="pointer-events-auto bg-[#050B14]/95 backdrop-blur-md border border-[#203A55] px-4 py-2.5 rounded shadow-2xl flex items-center gap-6 text-xs font-mono">
              <div className="flex items-center gap-2">
                <Mountain className="w-4 h-4 text-[#65D9E8]" />
                <span className="text-[10px] text-[#D8CEB9]/60 uppercase tracking-wider">3D TERRAIN SLICE:</span>
              </div>

              <div>
                <span className="text-[9px] text-[#D8CEB9]/60 block">COASTAL DIKE</span>
                <span className="font-bold text-[#E7A84A] text-sm">+2.10m MSL</span>
              </div>

              <div>
                <span className="text-[9px] text-[#D8CEB9]/60 block">SUBSTATION B (SWITCHYARD)</span>
                <span className="font-bold text-[#D95757] text-sm">+1.80m (BREACHED -0.62m)</span>
              </div>

              <div>
                <span className="text-[9px] text-[#D8CEB9]/60 block">DISTRICT HOSPITAL A</span>
                <span className="font-bold text-[#63C69A] text-sm">+4.50m (SAFE +2.08m)</span>
              </div>

              <div className="border-l border-[#203A55] pl-3 flex items-center gap-2">
                <span className="text-[9px] text-[#D8CEB9]/60">EXAGGERATION:</span>
                <button
                  onClick={() => setElevationExaggeration(prev => (prev === 2.5 ? 4.0 : 2.5))}
                  className="px-2 py-0.5 bg-[#091525] border border-[#65D9E8]/40 text-[#65D9E8] rounded text-[10px] hover:border-[#65D9E8]"
                >
                  {elevationExaggeration}x
                </button>
              </div>
            </div>

            {/* Selected Asset Direct Dispatch CTA */}
            {selectedAsset && (
              <div className="pointer-events-auto bg-[#050B14]/95 backdrop-blur-md border border-[#C7A45D] px-4 py-2 rounded shadow-2xl flex items-center gap-4 text-xs font-mono animate-in fade-in slide-in-from-bottom-2">
                <div>
                  <span className="text-[9px] text-[#C7A45D] block uppercase font-bold">{selectedAsset.type} · 3D ELEVATION</span>
                  <span className="font-bold text-[#F1EBDD]">{selectedAsset.name} (+{selectedAsset.elevationM}m)</span>
                </div>
                {onCompileForAsset && (
                  <button
                    onClick={() => onCompileForAsset(selectedAsset)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] font-bold text-[10px] rounded transition-colors shadow"
                  >
                    <span>COMPILE DIRECTIVE</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
