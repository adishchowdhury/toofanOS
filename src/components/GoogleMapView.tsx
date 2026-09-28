/// <reference types="google.maps" />
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap
} from '@vis.gl/react-google-maps';
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
  ArrowUpRight,
  ShieldAlert,
  AlertTriangle,
  Radio,
  Eye,
  Compass,
  Activity,
  Crosshair
} from 'lucide-react';

interface GoogleMapViewProps {
  scenario: CycloneScenario;
  assets: InfrastructureAsset[];
  selectedAsset: InfrastructureAsset | null;
  onSelectAsset: (asset: InfrastructureAsset | null) => void;
  timeOffset: number; // -6 to 0
  onCompileForAsset?: (asset: InfrastructureAsset) => void;
  onOpenDisclosure: () => void;
  onSwitchToTactical?: () => void;
  onSwitchToGoogleEarth?: () => void;
  onSwitchToWindy?: () => void;
  onOpenGeminiBriefing?: () => void;
}

// Fallback to user-provided key if env var is not yet reloaded by dev server
const GOOGLE_MAPS_API_KEY = 
  import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyAgykiYAhn1oBkSnQ1_rva539lqP067f74';

// Component that handles Polylines and Circles directly on the Google Map instance
const CycloneVectorOverlays: React.FC<{
  trackPoints: TrackPoint[];
  currentTrackPoint: TrackPoint;
  showStormTrack: boolean;
  showSurgeInundation: boolean;
}> = ({ trackPoints, currentTrackPoint, showStormTrack, showSurgeInundation }) => {
  const map = useMap();
  const polylineRef = useRef<google.maps.Polyline | null>(null);
  const surgeCircleRef = useRef<google.maps.Circle | null>(null);
  const eyeCircleRef = useRef<google.maps.Circle | null>(null);

  // Storm Track Polyline
  useEffect(() => {
    if (!map) return;

    if (polylineRef.current) {
      polylineRef.current.setMap(null);
      polylineRef.current = null;
    }

    if (showStormTrack && trackPoints.length > 0) {
      const path = trackPoints.map(tp => ({ lat: tp.lat, lng: tp.lon }));
      polylineRef.current = new google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#E7A84A',
        strokeOpacity: 0.9,
        strokeWeight: 4,
        map
      });
    }

    return () => {
      if (polylineRef.current) {
        polylineRef.current.setMap(null);
        polylineRef.current = null;
      }
    };
  }, [map, trackPoints, showStormTrack]);

  // Surge Inundation and Danger Radius Circles
  useEffect(() => {
    if (!map) return;

    if (surgeCircleRef.current) {
      surgeCircleRef.current.setMap(null);
      surgeCircleRef.current = null;
    }
    if (eyeCircleRef.current) {
      eyeCircleRef.current.setMap(null);
      eyeCircleRef.current = null;
    }

    if (showSurgeInundation) {
      // High danger storm surge zone (40 km radius)
      surgeCircleRef.current = new google.maps.Circle({
        strokeColor: '#65D9E8',
        strokeOpacity: 0.75,
        strokeWeight: 2,
        fillColor: '#65D9E8',
        fillOpacity: 0.16,
        map,
        center: { lat: currentTrackPoint.lat, lng: currentTrackPoint.lon },
        radius: 40000
      });

      // Extreme eye-wall wind zone (15 km radius)
      eyeCircleRef.current = new google.maps.Circle({
        strokeColor: '#D95757',
        strokeOpacity: 0.85,
        strokeWeight: 2,
        fillColor: '#D95757',
        fillOpacity: 0.22,
        map,
        center: { lat: currentTrackPoint.lat, lng: currentTrackPoint.lon },
        radius: 15000
      });
    }

    return () => {
      if (surgeCircleRef.current) {
        surgeCircleRef.current.setMap(null);
        surgeCircleRef.current = null;
      }
      if (eyeCircleRef.current) {
        eyeCircleRef.current.setMap(null);
        eyeCircleRef.current = null;
      }
    };
  }, [map, currentTrackPoint, showSurgeInundation]);

  return null;
};

// Map View Camera Controller for Preset zooms
const MapCameraController: React.FC<{
  centerTarget: { lat: number; lng: number } | null;
  zoomTarget: number | null;
}> = ({ centerTarget, zoomTarget }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    if (centerTarget) {
      map.panTo(centerTarget);
    }
    if (zoomTarget !== null) {
      map.setZoom(zoomTarget);
    }
  }, [map, centerTarget, zoomTarget]);

  return null;
};

export const GoogleMapView: React.FC<GoogleMapViewProps> = ({
  scenario,
  assets,
  selectedAsset,
  onSelectAsset,
  timeOffset,
  onCompileForAsset,
  onOpenDisclosure,
  onSwitchToTactical,
  onSwitchToGoogleEarth,
  onSwitchToWindy,
  onOpenGeminiBriefing
}) => {
  const [mapType, setMapType] = useState<'hybrid' | 'satellite' | 'roadmap' | 'terrain'>('hybrid');
  const [showLayerPanel, setShowLayerPanel] = useState(false);
  const [cameraTarget, setCameraTarget] = useState<{ center: { lat: number; lng: number } | null; zoom: number | null }>({
    center: null,
    zoom: null
  });

  // Layer toggles
  const [layers, setLayers] = useState({
    surgeInundation: true,
    stormTrack: true,
    hospitals: true,
    substations: true,
    shelters: true,
    roads: true
  });

  // Current storm position based on timeOffset
  const currentTrackPoint: TrackPoint = useMemo(() => {
    const exact = scenario.trackPoints.find(p => p.timeOffsetHours === timeOffset);
    if (exact) return exact;
    return scenario.trackPoints[0];
  }, [scenario, timeOffset]);

  // Filter visible assets
  const visibleAssets = useMemo(() => {
    return assets.filter(asset => {
      if (asset.type === 'hospital' && !layers.hospitals) return false;
      if (asset.type === 'substation' && !layers.substations) return false;
      if (asset.type === 'shelter' && !layers.shelters) return false;
      if (asset.type === 'road' && !layers.roads) return false;
      return true;
    });
  }, [assets, layers]);

  // Quick preset camera moves
  const handlePresetFocus = (preset: 'eye' | 'coast' | 'all') => {
    if (preset === 'eye') {
      setCameraTarget({
        center: { lat: currentTrackPoint.lat, lng: currentTrackPoint.lon },
        zoom: 11
      });
    } else if (preset === 'coast') {
      setCameraTarget({
        center: { lat: 21.65, lng: 87.55 },
        zoom: 10
      });
    } else {
      setCameraTarget({
        center: { lat: 21.60, lng: 87.60 },
        zoom: 9
      });
    }
  };

  return (
    <div className="relative w-full h-full bg-[#050B14] overflow-hidden select-none">
      {/* Top Floating Telemetry & Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-10 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left Badge: Live Satellite Feed + Active Cyclone */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#050B14]/90 backdrop-blur-md border border-[#203A55]/80 px-3 py-1.5 rounded shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D95757] animate-ping" />
            <span className="text-[11px] font-mono font-bold text-[#F1EBDD] uppercase tracking-wider">
              GOOGLE MAPS™ SATELLITE
            </span>
          </div>
          <span className="text-[#203A55]">|</span>
          <span className="text-[11px] font-serif text-[#C7A45D]">
            {scenario.name}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#D95757]/20 text-[#D95757] border border-[#D95757]/40 font-semibold">
            {currentTrackPoint.windSpeedKmh} km/h
          </span>
        </div>

        {/* Center / Right Quick Controls */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          {/* Preset Camera Jumps */}
          <div className="flex items-center bg-[#050B14]/90 backdrop-blur-md border border-[#203A55]/80 rounded p-0.5">
            <button
              onClick={() => handlePresetFocus('eye')}
              className="px-2.5 py-1 text-[10px] font-mono text-[#D8CEB9] hover:text-[#65D9E8] hover:bg-[#0D1C2D] rounded transition-colors flex items-center gap-1"
              title="Focus on storm center"
            >
              <Crosshair className="w-3 h-3 text-[#D95757]" />
              <span>EYE</span>
            </button>
            <button
              onClick={() => handlePresetFocus('coast')}
              className="px-2.5 py-1 text-[10px] font-mono text-[#D8CEB9] hover:text-[#C7A45D] hover:bg-[#0D1C2D] rounded transition-colors"
              title="Focus on coastal landfall line"
            >
              COASTLINE
            </button>
            <button
              onClick={() => handlePresetFocus('all')}
              className="px-2.5 py-1 text-[10px] font-mono text-[#D8CEB9] hover:text-[#F1EBDD] hover:bg-[#0D1C2D] rounded transition-colors"
              title="Regional overview"
            >
              REGIONAL
            </button>
          </div>

          {/* Map Type Switcher */}
          <div className="flex items-center bg-[#050B14]/90 backdrop-blur-md border border-[#203A55]/80 rounded p-0.5">
            <button
              onClick={() => setMapType('hybrid')}
              className={`px-2 py-1 text-[10px] font-mono rounded transition-colors ${
                mapType === 'hybrid' 
                  ? 'bg-[#C7A45D] text-[#050B14] font-bold' 
                  : 'text-[#D8CEB9] hover:text-[#F1EBDD]'
              }`}
            >
              HYBRID
            </button>
            <button
              onClick={() => setMapType('satellite')}
              className={`px-2 py-1 text-[10px] font-mono rounded transition-colors ${
                mapType === 'satellite' 
                  ? 'bg-[#C7A45D] text-[#050B14] font-bold' 
                  : 'text-[#D8CEB9] hover:text-[#F1EBDD]'
              }`}
            >
              SATELLITE
            </button>
            <button
              onClick={() => setMapType('terrain')}
              className={`px-2 py-1 text-[10px] font-mono rounded transition-colors ${
                mapType === 'terrain' 
                  ? 'bg-[#C7A45D] text-[#050B14] font-bold' 
                  : 'text-[#D8CEB9] hover:text-[#F1EBDD]'
              }`}
            >
              TERRAIN
            </button>
          </div>

          {/* Layers Toggle Button */}
          <button
            onClick={() => setShowLayerPanel(!showLayerPanel)}
            className={`p-1.5 rounded border transition-colors ${
              showLayerPanel 
                ? 'bg-[#C7A45D] text-[#050B14] border-[#C7A45D]' 
                : 'bg-[#050B14]/90 text-[#D8CEB9] border-[#203A55]/80 hover:text-[#F1EBDD]'
            }`}
            title="Toggle Map Layers"
          >
            <Layers className="w-4 h-4" />
          </button>

          {/* Cross Engine Jump: Google Earth 3D */}
          {onSwitchToGoogleEarth && (
            <button
              onClick={onSwitchToGoogleEarth}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091525]/90 hover:bg-[#0D1C2D] border border-[#65D9E8]/40 hover:border-[#65D9E8] text-[#65D9E8] rounded text-[10px] font-mono font-bold tracking-wider transition-colors shadow-lg"
              title="Switch to Google Earth 3D Orbital & Elevation Model"
            >
              <span>GOOGLE EARTH™ 3D</span>
            </button>
          )}

          {/* Cross Engine Jump: Windy.com */}
          {onSwitchToWindy && (
            <button
              onClick={onSwitchToWindy}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091525]/90 hover:bg-[#0D1C2D] border border-[#E7A84A]/40 hover:border-[#E7A84A] text-[#E7A84A] rounded text-[10px] font-mono font-bold tracking-wider transition-colors shadow-lg"
              title="Switch to Windy.com Live Particle Streamlines"
            >
              <span>WINDY.COM™</span>
            </button>
          )}

          {/* Gemini AI Briefing Trigger */}
          {onOpenGeminiBriefing && (
            <button
              onClick={onOpenGeminiBriefing}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] rounded text-[10px] font-mono font-bold tracking-wider transition-colors shadow-lg animate-pulse"
              title="Synthesize Satellite with Gemini 3.8 Flash"
            >
              <span>GEMINI AI SYNTHESIS</span>
            </button>
          )}

          {/* Switch to Tactical SVG Chart */}
          {onSwitchToTactical && (
            <button
              onClick={onSwitchToTactical}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091525]/90 hover:bg-[#0D1C2D] border border-[#D8CEB9]/40 hover:border-[#D8CEB9] text-[#D8CEB9] rounded text-[10px] font-mono font-bold tracking-wider transition-colors shadow-lg"
              title="Switch to Tactical Cartographic Chart"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>TACTICAL</span>
            </button>
          )}
        </div>
      </div>

      {/* Layers Panel Popover */}
      {showLayerPanel && (
        <div className="absolute top-14 right-3 w-64 bg-[#050B14]/95 backdrop-blur-md border border-[#203A55] p-3 rounded shadow-2xl z-20 space-y-2 select-none text-xs font-mono animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-[#203A55] pb-1.5">
            <span className="text-[10px] text-[#C7A45D] uppercase tracking-wider font-bold">
              GOOGLE MAP LAYERS
            </span>
            <button 
              onClick={() => setShowLayerPanel(false)}
              className="text-[#D8CEB9]/60 hover:text-[#F1EBDD]"
            >
              ✕
            </button>
          </div>

          {[
            { key: 'surgeInundation', label: 'Surge Inundation Buffer', color: '#65D9E8' },
            { key: 'stormTrack', label: 'Cyclone Track & Eye', color: '#E7A84A' },
            { key: 'hospitals', label: 'Hospitals & Medical Units', color: '#D95757' },
            { key: 'substations', label: 'Power Grid Substations', color: '#E2C98A' },
            { key: 'shelters', label: 'Evacuation Shelters', color: '#63C69A' },
            { key: 'roads', label: 'Corridor Access (Roads)', color: '#F1EBDD' }
          ].map(layer => (
            <label key={layer.key} className="flex items-center justify-between cursor-pointer py-1 hover:text-[#F1EBDD]">
              <span className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: layer.color }} />
                <span className="text-[#D8CEB9]">{layer.label}</span>
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

      {/* Main Google Maps Canvas via @vis.gl/react-google-maps */}
      <div className="w-full h-full">
        <APIProvider apiKey={GOOGLE_MAPS_API_KEY} solutionChannel="GMP_visgl_reactgooglemaps_v1.0.0">
          <Map
            id="cycloneos-google-map"
            mapId="DEMO_MAP_ID"
            internalUsageAttributionIds={["gmp_mcp_codeassist_v1_aistudio"]}
            defaultCenter={{ lat: 21.65, lng: 87.55 }}
            defaultZoom={10}
            mapTypeId={mapType}
            gestureHandling="greedy"
            disableDefaultUI={false}
            style={{ width: '100%', height: '100%' }}
          >
            {/* Vector Overlays for Track Polyline & Surge Buffers */}
            <CycloneVectorOverlays
              trackPoints={scenario.trackPoints}
              currentTrackPoint={currentTrackPoint}
              showStormTrack={layers.stormTrack}
              showSurgeInundation={layers.surgeInundation}
            />

            {/* Camera controller for presets */}
            <MapCameraController
              centerTarget={cameraTarget.center}
              zoomTarget={cameraTarget.zoom}
            />

            {/* Cyclone Eye Marker */}
            {layers.stormTrack && (
              <AdvancedMarker
                position={{ lat: currentTrackPoint.lat, lng: currentTrackPoint.lon }}
                title={`Cyclone Eye: ${scenario.name} (${currentTrackPoint.windSpeedKmh} km/h)`}
              >
                <div className="relative group cursor-pointer">
                  {/* Outer pulsating danger ring */}
                  <div className="absolute -inset-4 rounded-full border-2 border-[#D95757] animate-ping opacity-60 pointer-events-none" />
                  <div className="absolute -inset-2 rounded-full bg-[#D95757]/20 animate-pulse pointer-events-none" />

                  {/* Core cyclone eye glyph */}
                  <div className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#050B14] border-2 border-[#D95757] shadow-[0_0_20px_rgba(217,87,87,0.8)] text-[#D95757]">
                    <Eye className="w-5 h-5 animate-spin" style={{ animationDuration: '4s' }} />
                  </div>

                  {/* Badge floating above eye */}
                  <div className="absolute left-1/2 -translate-x-1/2 -top-8 px-2 py-0.5 bg-[#050B14]/95 border border-[#D95757] rounded text-[9px] font-mono font-bold text-[#F1EBDD] whitespace-nowrap shadow-xl">
                    <span>{currentTrackPoint.windSpeedKmh} km/h · {currentTrackPoint.stage || scenario.category}</span>
                  </div>
                </div>
              </AdvancedMarker>
            )}

            {/* Historical Track Points */}
            {layers.stormTrack && scenario.trackPoints.map((tp, idx) => (
              <AdvancedMarker
                key={`track-${idx}`}
                position={{ lat: tp.lat, lng: tp.lon }}
                title={`Track T${tp.timeOffsetHours}:00`}
              >
                <div className="flex items-center gap-1 bg-[#050B14]/90 border border-[#E7A84A] px-1.5 py-0.5 rounded-full text-[8px] font-mono text-[#E7A84A] shadow-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E7A84A]" />
                  <span>{tp.timeOffsetHours === 0 ? 'LANDFALL' : `T${tp.timeOffsetHours}h`}</span>
                </div>
              </AdvancedMarker>
            ))}

            {/* Infrastructure Asset Markers */}
            {visibleAssets.map(asset => {
              const isSelected = selectedAsset?.id === asset.id;
              const isCritical = asset.criticality > 0.8;

              // Color mapping
              let markerColor = '#63C69A';
              let badgeBg = 'bg-[#63C69A]/20 border-[#63C69A] text-[#63C69A]';
              let Icon = Building2;

              if (asset.type === 'hospital') {
                markerColor = '#D95757';
                badgeBg = 'bg-[#D95757]/30 border-[#D95757] text-[#D95757]';
                Icon = ShieldAlert;
              } else if (asset.type === 'substation') {
                markerColor = '#E2C98A';
                badgeBg = 'bg-[#E2C98A]/30 border-[#E2C98A] text-[#E2C98A]';
                Icon = Zap;
              } else if (asset.type === 'shelter') {
                markerColor = '#65D9E8';
                badgeBg = 'bg-[#65D9E8]/30 border-[#65D9E8] text-[#65D9E8]';
                Icon = Home;
              } else if (asset.type === 'road') {
                markerColor = '#F1EBDD';
                badgeBg = 'bg-[#F1EBDD]/30 border-[#F1EBDD] text-[#F1EBDD]';
                Icon = Navigation;
              }

              return (
                <AdvancedMarker
                  key={asset.id}
                  position={{ lat: asset.lat, lng: asset.lon }}
                  onClick={() => onSelectAsset(asset)}
                  title={`${asset.name} (${asset.type})`}
                >
                  <div className={`relative flex items-center justify-center p-1.5 rounded-full border-2 transition-transform cursor-pointer ${
                    isSelected ? 'scale-125 ring-4 ring-[#C7A45D] bg-[#050B14]' : 'hover:scale-110 bg-[#050B14]/90'
                  }`}
                  style={{ borderColor: markerColor }}
                  >
                    {isCritical && (
                      <span 
                        className="absolute -inset-1 rounded-full animate-ping opacity-75"
                        style={{ backgroundColor: markerColor }}
                      />
                    )}
                    <Icon className="w-3.5 h-3.5" style={{ color: markerColor }} />

                    {/* Small name chip on hover */}
                    <div className="absolute left-1/2 -translate-x-1/2 -bottom-5 px-1.5 py-0.2 bg-[#050B14]/95 border border-[#203A55] rounded text-[8px] font-mono text-[#F1EBDD] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                      {asset.name}
                    </div>
                  </div>
                </AdvancedMarker>
              );
            })}

            {/* InfoWindow for Selected Asset */}
            {selectedAsset && (
              <InfoWindow
                position={{ lat: selectedAsset.lat, lng: selectedAsset.lon }}
                onCloseClick={() => onSelectAsset(null)}
                maxWidth={320}
              >
                <div className="p-1 font-mono text-xs text-[#050B14] space-y-2">
                  <div className="border-b border-[#203A55]/30 pb-1.5">
                    <span className="text-[9px] uppercase font-bold tracking-wider text-[#C7A45D]">
                      {selectedAsset.type.toUpperCase()} · CRITICAL ASSET
                    </span>
                    <h4 className="text-sm font-bold text-[#050B14] font-serif leading-tight">
                      {selectedAsset.name}
                    </h4>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[10px] bg-[#F1EBDD]/50 p-2 rounded">
                    <div>
                      <span className="text-[#6F8296] block text-[9px]">CRITICALITY</span>
                      <span className="font-bold text-[#D95757]">{selectedAsset.criticality.toFixed(2)} / 1.0</span>
                    </div>
                    <div>
                      <span className="text-[#6F8296] block text-[9px]">EXPOSURE</span>
                      <span className="font-bold text-[#E7A84A]">{selectedAsset.exposureScore.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-[#6F8296] block text-[9px]">SURGE ETA</span>
                      <span className="font-bold text-[#0B1C2E]">0{selectedAsset.surgeEtaHours.toFixed(1)}:00 HRS</span>
                    </div>
                    <div>
                      <span className="text-[#6F8296] block text-[9px]">ELEVATION</span>
                      <span className="font-medium text-[#0B1C2E]">+{selectedAsset.elevationM}m MSL</span>
                    </div>
                  </div>

                  {selectedAsset.accessRoad && (
                    <div className="text-[10px]">
                      <span className="text-[#6F8296]">Access Route: </span>
                      <span className="font-semibold text-[#D95757]">{selectedAsset.accessRoad}</span>
                    </div>
                  )}

                  {selectedAsset.backupPower && (
                    <div className="text-[10px]">
                      <span className="text-[#6F8296]">Power Backup: </span>
                      <span className="font-semibold text-[#0B1C2E]">{selectedAsset.backupPower}</span>
                    </div>
                  )}

                  <p className="text-[10px] text-[#6F8296] italic leading-tight">
                    {selectedAsset.details.vulnerabilityNote}
                  </p>

                  {onCompileForAsset && (
                    <button
                      onClick={() => onCompileForAsset(selectedAsset)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-[#050B14] hover:bg-[#0D1C2D] text-[#C7A45D] text-[10px] font-bold rounded tracking-wider transition-colors shadow"
                    >
                      <span>COMPILE DECISION DIRECTIVE</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </InfoWindow>
            )}
          </Map>
        </APIProvider>
      </div>

      {/* Floating Detailed Asset Card (Synced with Selected Asset) */}
      {selectedAsset && (
        <div className="absolute bottom-4 left-4 max-w-sm bg-[#050B14]/95 backdrop-blur-md border border-[#C7A45D]/80 p-4 rounded shadow-2xl z-20 space-y-3 font-mono animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] tracking-wider text-[#C7A45D] uppercase font-bold">
                GOOGLE MAPS TELEMETRY · {selectedAsset.type.toUpperCase()}
              </div>
              <h3 className="text-sm font-bold text-[#F1EBDD]">
                {selectedAsset.name}
              </h3>
            </div>
            <button
              onClick={() => onSelectAsset(null)}
              className="text-[#D8CEB9]/60 hover:text-[#F1EBDD] text-sm"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] bg-[#091525] p-2.5 rounded border border-[#203A55]/60">
            <div>
              <span className="text-[#D8CEB9]/50 text-[10px]">CRITICALITY</span>
              <div className="font-bold text-[#D95757]">{selectedAsset.criticality.toFixed(2)} / 1.0</div>
            </div>
            <div>
              <span className="text-[#D8CEB9]/50 text-[10px]">EXPOSURE INDEX</span>
              <div className="font-bold text-[#E7A84A]">{selectedAsset.exposureScore.toFixed(2)}</div>
            </div>
            <div>
              <span className="text-[#D8CEB9]/50 text-[10px]">SURGE ETA</span>
              <div className="font-bold text-[#65D9E8]">0{selectedAsset.surgeEtaHours.toFixed(1)}:00 HRS</div>
            </div>
            <div>
              <span className="text-[#D8CEB9]/50 text-[10px]">GEO COORDINATE</span>
              <div className="text-[#F1EBDD] text-[10px]">{selectedAsset.lat.toFixed(3)}°N, {selectedAsset.lon.toFixed(3)}°E</div>
            </div>
          </div>

          {selectedAsset.details.vulnerabilityNote && (
            <div className="text-[10px] text-[#D8CEB9]/80 border-t border-[#203A55]/60 pt-2">
              <span className="text-[#C7A45D] font-bold">VULNERABILITY: </span>
              <span>{selectedAsset.details.vulnerabilityNote}</span>
            </div>
          )}

          {onCompileForAsset && (
            <button
              onClick={() => onCompileForAsset(selectedAsset)}
              className="w-full flex items-center justify-center gap-2 py-1.5 bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] text-xs font-bold rounded tracking-wider transition-colors shadow-md"
            >
              <span>DISPATCH REINFORCEMENTS</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Bottom Right Cartographic Legend */}
      <div className="absolute bottom-3 right-3 bg-[#050B14]/90 backdrop-blur-md border border-[#203A55]/80 px-3 py-2 rounded text-[10px] font-mono space-y-1.5 shadow-xl pointer-events-none">
        <div className="text-[#D8CEB9]/60 tracking-wider uppercase font-semibold text-[9px]">
          GOOGLE MAPS RISK CLASSIFICATION
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D95757]" />
            <span className="text-[#D8CEB9]/80">Critical (&gt;0.85)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E7A84A]" />
            <span className="text-[#D8CEB9]/80">High (0.7-0.85)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#63C69A]" />
            <span className="text-[#D8CEB9]/80">Controlled (&lt;0.5)</span>
          </span>
        </div>
      </div>
    </div>
  );
};
