import React from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  Building2, 
  Home, 
  CheckCircle2
} from 'lucide-react';

interface BottomEventTimelineProps {
  timeOffset: number; // -6 to 0
  setTimeOffset: (time: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  onSelectMilestone: (time: number, label: string) => void;
}

export const BottomEventTimeline: React.FC<BottomEventTimelineProps> = ({
  timeOffset,
  setTimeOffset,
  isPlaying,
  setIsPlaying,
  onSelectMilestone
}) => {
  const milestones = [
    {
      time: -6,
      label: 'T−06:00',
      tag: 'OUTER GALE',
      desc: 'IMD Rainbands Reach Coast',
      type: 'weather'
    },
    {
      time: -5,
      label: 'T−05:00',
      tag: 'SUBSTATION B',
      desc: 'Mobile Generator Deployment Window',
      type: 'grid',
      deadline: '01:05'
    },
    {
      time: -4,
      label: 'T−04:00',
      tag: 'WARD 4 SHELTER',
      desc: 'Coastal Bus Staging Deadline',
      type: 'municipal',
      deadline: '01:40'
    },
    {
      time: -3,
      label: 'T−03:00',
      tag: 'HOSPITAL A',
      desc: 'Patient Transit Corridor Cut-Off',
      type: 'hospital',
      deadline: '02:10'
    },
    {
      time: -2,
      label: 'T−02:00',
      tag: 'SURGE BREACH',
      desc: '2.42m Surge Exceeds 2.0m Policy Threshold',
      type: 'insurance',
      breach: true
    },
    {
      time: 0,
      label: 'T−00:00',
      tag: 'LANDFALL',
      desc: 'Eye Passes Coast at Digha / Bakkhali',
      type: 'landfall'
    }
  ];

  return (
    <div className="h-20 border-t border-[#12253A] bg-[#050B14]/95 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between z-20 select-none shadow-2xl">
      {/* Play / Scrubber Controls */}
      <div className="flex items-center gap-3.5 pr-4 border-r border-[#12253A]">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded-sm bg-[#091525] hover:bg-[#12253A] text-[#F1EBDD] border border-[#12253A] transition-colors shadow-inner"
          title={isPlaying ? "Pause timeline progression" : "Play timeline simulation"}
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#E7A84A]" /> : <Play className="w-3.5 h-3.5 text-[#65D9E8] fill-[#65D9E8]" />}
        </button>

        <button
          onClick={() => {
            setIsPlaying(false);
            setTimeOffset(-6);
          }}
          className="p-2 rounded-sm bg-[#091525] hover:bg-[#12253A] text-[#6F8296] hover:text-[#F1EBDD] border border-[#12253A] transition-colors shadow-inner"
          title="Reset to T-06:00"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div>
          <div className="text-[10px] font-mono text-[#6F8296] tracking-wider uppercase">
            EVENT TIMELINE
          </div>
          <div className="text-xs font-mono font-bold text-[#E2C98A]">
            {timeOffset === 0 ? 'T−00:00 (LANDFALL)' : `T−0${Math.abs(timeOffset)}:00`}
          </div>
        </div>
      </div>

      {/* Horizontal Milestone Pipeline Track */}
      <div className="flex-1 px-6 flex items-center justify-between relative overflow-x-auto py-1">
        {/* Horizontal Connector Line */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-[2px] bg-[#12253A] z-0" />
        
        {/* Active Progress Line */}
        <div 
          className="absolute left-8 top-1/2 -translate-y-1/2 h-[2px] bg-[#C7A45D] transition-all duration-300 z-0 shadow-[0_0_8px_#C7A45D]"
          style={{ width: `${((timeOffset + 6) / 6) * 92}%` }}
        />

        {milestones.map((ms) => {
          const isCurrent = timeOffset === ms.time;
          const isPast = timeOffset > ms.time;

          let dotColor = '#6F8296';
          if (ms.type === 'grid') dotColor = '#E2C98A';
          if (ms.type === 'municipal') dotColor = '#65D9E8';
          if (ms.type === 'hospital') dotColor = '#D95757';
          if (ms.type === 'insurance') dotColor = '#C7A45D';
          if (ms.type === 'landfall') dotColor = '#D95757';

          return (
            <button
              key={ms.label}
              onClick={() => {
                setTimeOffset(ms.time);
                onSelectMilestone(ms.time, ms.tag);
              }}
              className={`relative z-10 flex flex-col items-center group transition-all cursor-pointer focus:outline-none px-2`}
            >
              {/* Event Time Stamp */}
              <span className={`text-[10px] font-mono mb-1 transition-colors ${
                isCurrent ? 'text-[#E2C98A] font-bold' : isPast ? 'text-[#9BB0C1]' : 'text-[#6F8296]'
              }`}>
                {ms.label}
              </span>

              {/* Marker Dot */}
              <div 
                className={`w-3.5 h-3.5 rounded-full border-2 transition-transform ${
                  isCurrent 
                    ? 'scale-125 border-[#F1EBDD] shadow-[0_0_12px_rgba(199,164,93,0.9)]' 
                    : 'border-[#050B14] group-hover:scale-110'
                }`}
                style={{ backgroundColor: dotColor }}
              />

              {/* Tag / Headline */}
              <span className={`text-[9px] font-mono mt-1 font-semibold tracking-wider whitespace-nowrap transition-colors ${
                isCurrent ? 'text-[#F1EBDD]' : 'text-[#6F8296] group-hover:text-[#9BB0C1]'
              }`}>
                {ms.tag}
              </span>
            </button>
          );
        })}
      </div>

      {/* Right: Time Pressure Annotation */}
      <div className="hidden xl:flex items-center gap-3 pl-4 border-l border-[#12253A] text-right font-mono">
        <div>
          <div className="text-[10px] text-[#E7A84A] font-bold">
            WINDOW TO ACTION
          </div>
          <div className="text-[9px] text-[#6F8296]">
            3 critical deadlines expire before T−02:00
          </div>
        </div>
      </div>
    </div>
  );
};
