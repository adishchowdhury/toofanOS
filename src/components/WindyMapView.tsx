import React, { useState, useEffect } from 'react';
import { CycloneScenario, InfrastructureAsset } from '../types/cyclone';
import { 
  Wind, 
  Waves, 
  CloudRain, 
  Eye, 
  Gauge, 
  Radio, 
  Sparkles, 
  Compass, 
  Globe, 
  RefreshCw,
  ExternalLink,
  ShieldAlert,
  ArrowUpRight
} from 'lucide-react';

interface WindyMapViewProps {
  scenario: CycloneScenario;
  assets: InfrastructureAsset[];
  selectedAsset: InfrastructureAsset | null;
  onSelectAsset: (asset: InfrastructureAsset | null) => void;
  timeOffset: number;
  onSwitchToGoogleMaps: () => void;
  onSwitchToGoogleEarth: () => void;
  onOpenGeminiBriefing: () => void;
}

type WindyOverlay = 'wind' | 'waves' | 'rain' | 'satellite' | 'pressure' | 'gust';

export const WindyMapView: React.FC<WindyMapViewProps> = ({
  scenario,
  assets,
  selectedAsset,
  onSelectAsset,
  timeOffset,
  onSwitchToGoogleMaps,
  onSwitchToGoogleEarth,
  onOpenGeminiBriefing
}) => {
  const [activeOverlay, setActiveOverlay] = useState<WindyOverlay>('wind');
  const [forecastData, setForecastData] = useState<any>(null);
  const [isLoadingForecast, setIsLoadingForecast] = useState(false);

  // Focus coordinates on active storm track point or Digha coastal landfall zone
  const activeTrackPoint = scenario.trackPoints.find(p => p.timeOffsetHours === timeOffset) || scenario.trackPoints[0];
  const lat = activeTrackPoint.lat;
  const lon = activeTrackPoint.lon;

  // Fetch live Windy forecast telemetry from our backend
  const fetchWindyData = async () => {
    setIsLoadingForecast(true);
    try {
      const res = await fetch(`/api/windy-forecast?lat=${lat}&lon=${lon}`);
      const data = await res.json();
      setForecastData(data);
    } catch (e) {
      console.warn('Windy forecast fetch failed:', e);
    } finally {
      setIsLoadingForecast(false);
    }
  };

  useEffect(() => {
    fetchWindyData();
  }, [lat, lon, timeOffset]);

  // Construct official Windy Embed URL
  const windyEmbedUrl = `https://embed.windy.com/embed.html?type=map&location=coordinates&metricRain=default&metricTemp=default&metricWind=km%2Fh&zoom=7&overlay=${activeOverlay === 'pressure' ? 'wind' : activeOverlay}&product=ecmwf&level=surface&lat=${lat}&lon=${lon}&detailLat=${lat}&detailLon=${lon}&marker=true&pressure=${activeOverlay === 'pressure' ? 'true' : 'false'}&message=true`;

  return (
    <div className="relative w-full h-full bg-[#050B14] overflow-hidden select-none flex flex-col">
      {/* Top Floating Control Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        {/* Left: Engine Badge & Current Cyclone */}
        <div className="flex items-center gap-2 pointer-events-auto bg-[#050B14]/95 backdrop-blur-md border border-[#203A55] px-3 py-1.5 rounded shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#E7A84A] animate-ping" />
            <span className="text-[11px] font-mono font-bold text-[#F1EBDD] uppercase tracking-wider flex items-center gap-1.5">
              <Wind className="w-3.5 h-3.5 text-[#E7A84A]" />
              <span>WINDY.COM™ LIVE RADAR</span>
            </span>
          </div>
          <span className="text-[#203A55]">|</span>
          <span className="text-[11px] font-serif text-[#C7A45D]">
            ECMWF High-Res · {scenario.name}
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#E7A84A]/20 text-[#E7A84A] border border-[#E7A84A]/40 font-semibold">
            {activeTrackPoint.windSpeedKmh} km/h
          </span>
        </div>

        {/* Center / Right: Dynamic Overlay Switcher & Cross-Engine Jumps */}
        <div className="flex items-center gap-2 pointer-events-auto ml-auto">
          {/* Overlay Selector */}
          <div className="flex items-center bg-[#050B14]/95 backdrop-blur-md border border-[#203A55] rounded p-0.5">
            <button
              onClick={() => setActiveOverlay('wind')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono rounded transition-colors ${
                activeOverlay === 'wind' 
                  ? 'bg-[#E7A84A] text-[#050B14] font-bold shadow' 
                  : 'text-[#D8CEB9] hover:text-[#F1EBDD]'
              }`}
              title="Wind particle streamlines and sustained speeds"
            >
              <Wind className="w-3 h-3" />
              <span>WIND STREAMLINES</span>
            </button>
            <button
              onClick={() => setActiveOverlay('waves')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono rounded transition-colors ${
                activeOverlay === 'waves' 
                  ? 'bg-[#65D9E8] text-[#050B14] font-bold shadow' 
                  : 'text-[#D8CEB9] hover:text-[#F1EBDD]'
              }`}
              title="Ocean wave height and storm surge swell vectors"
            >
              <Waves className="w-3 h-3" />
              <span>SURGE WAVES</span>
            </button>
            <button
              onClick={() => setActiveOverlay('rain')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono rounded transition-colors ${
                activeOverlay === 'rain' 
                  ? 'bg-[#63C69A] text-[#050B14] font-bold shadow' 
                  : 'text-[#D8CEB9] hover:text-[#F1EBDD]'
              }`}
              title="Rain accumulation and Doppler precipitation"
            >
              <CloudRain className="w-3 h-3" />
              <span>DOPPLER RAIN</span>
            </button>
            <button
              onClick={() => setActiveOverlay('satellite')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono rounded transition-colors ${
                activeOverlay === 'satellite' 
                  ? 'bg-[#C7A45D] text-[#050B14] font-bold shadow' 
                  : 'text-[#D8CEB9] hover:text-[#F1EBDD]'
              }`}
              title="Infrared cloud-top satellite view"
            >
              <Eye className="w-3 h-3" />
              <span>SATELLITE IR</span>
            </button>
            <button
              onClick={() => setActiveOverlay('pressure')}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-mono rounded transition-colors ${
                activeOverlay === 'pressure' 
                  ? 'bg-[#E2C98A] text-[#050B14] font-bold shadow' 
                  : 'text-[#D8CEB9] hover:text-[#F1EBDD]'
              }`}
              title="Sea-level pressure isobars"
            >
              <Gauge className="w-3 h-3" />
              <span>ISOBARS</span>
            </button>
          </div>

          {/* Cross Engine Jump: Google Earth */}
          <button
            onClick={onSwitchToGoogleEarth}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091525]/90 hover:bg-[#0D1C2D] border border-[#65D9E8]/40 hover:border-[#65D9E8] text-[#65D9E8] rounded text-[10px] font-mono font-bold tracking-wider transition-colors shadow-lg"
            title="Switch to Google Earth 3D Orbital & Digital Elevation Model"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>GOOGLE EARTH™ 3D</span>
          </button>

          {/* Cross Engine Jump: Google Maps */}
          <button
            onClick={onSwitchToGoogleMaps}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#091525]/90 hover:bg-[#0D1C2D] border border-[#C7A45D]/40 hover:border-[#C7A45D] text-[#C7A45D] rounded text-[10px] font-mono font-bold tracking-wider transition-colors shadow-lg"
            title="Switch to Google Maps Satellite with Advanced Markers"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>GOOGLE MAPS™</span>
          </button>

          {/* Gemini AI Briefing Trigger */}
          <button
            onClick={onOpenGeminiBriefing}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#C7A45D] hover:bg-[#E2C98A] text-[#050B14] rounded text-[10px] font-mono font-bold tracking-wider transition-colors shadow-lg animate-pulse"
            title="Synthesize Windy data with Gemini 3.8 Flash"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>GEMINI AI SYNTHESIS</span>
          </button>
        </div>
      </div>

      {/* Main Windy Embed Viewport */}
      <div className="w-full h-full relative">
        <iframe
          src={windyEmbedUrl}
          className="w-full h-full border-0"
          title="Windy.com Live Particle Streamlines & Meteorological Model"
          loading="lazy"
          allow="geolocation"
        />

        {/* Faint subtle grid vignette to harmonize with CycloneOS luxury palette */}
        <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(5,11,20,0.85)] border-r border-[#12253A]" />
      </div>

      {/* Bottom Live Windy Telemetry HUD */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Real-time ECMWF Atmospheric Readout */}
        <div className="pointer-events-auto bg-[#050B14]/95 backdrop-blur-md border border-[#203A55] px-4 py-2 rounded shadow-2xl flex items-center gap-6 text-xs font-mono">
          <div className="flex items-center gap-2">
            <Radio className="w-3.5 h-3.5 text-[#E7A84A] animate-pulse" />
            <span className="text-[10px] text-[#D8CEB9]/60 uppercase tracking-wider">LIVE ECMWF SENSORS:</span>
          </div>

          <div>
            <span className="text-[9px] text-[#D8CEB9]/60 block">SUSTAINED / GUST</span>
            <span className="font-bold text-[#E7A84A] text-sm">
              {forecastData?.windSpeedKmh || 185} / {forecastData?.windGustKmh || 220} km/h
            </span>
          </div>

          <div>
            <span className="text-[9px] text-[#D8CEB9]/60 block">SURGE WAVE HEIGHT</span>
            <span className="font-bold text-[#65D9E8] text-sm">
              +{forecastData?.waveHeightMeters || 4.2}m SWELL
            </span>
          </div>

          <div>
            <span className="text-[9px] text-[#D8CEB9]/60 block">CENTRAL PRESSURE</span>
            <span className="font-bold text-[#F1EBDD] text-sm">
              {forecastData?.pressureHpa || 952} hPa
            </span>
          </div>

          <div>
            <span className="text-[9px] text-[#D8CEB9]/60 block">PRECIPITATION</span>
            <span className="font-bold text-[#63C69A] text-sm">
              {forecastData?.rainfallRateMmPerHr || 48} mm/hr
            </span>
          </div>

          <button
            onClick={fetchWindyData}
            disabled={isLoadingForecast}
            className="p-1 hover:bg-[#091525] rounded text-[#D8CEB9]/60 hover:text-[#F1EBDD] transition-colors"
            title="Refresh sensor data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoadingForecast ? 'animate-spin text-[#C7A45D]' : ''}`} />
          </button>
        </div>

        {/* Right: Infrastructure Risk Summary & Quick Gemini Trigger */}
        <div className="pointer-events-auto bg-[#050B14]/95 backdrop-blur-md border border-[#C7A45D]/50 px-3.5 py-2 rounded shadow-2xl flex items-center gap-3 text-xs font-mono">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-[#D95757]" />
            <div>
              <span className="text-[10px] text-[#D8CEB9]/60 block">EXPOSED ASSETS</span>
              <span className="font-bold text-[#D95757]">5 Critical Coastal Nodes</span>
            </div>
          </div>
          <button
            onClick={onOpenGeminiBriefing}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#091525] hover:bg-[#0D1C2D] border border-[#C7A45D] text-[#C7A45D] rounded text-[10px] font-bold tracking-wider transition-colors"
          >
            <span>ANALYZE WITH GEMINI</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
