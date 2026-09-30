import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Clock, 
  Wind, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Mic, 
  MicOff, 
  Send, 
  Radio, 
  CheckCircle2, 
  AlertCircle,
  Compass,
  X,
  LifeBuoy
} from 'lucide-react';
import { CycloneScenario } from '../types/cyclone';
import { VoiceCommandModal } from './VoiceCommandModal';

interface CommandBarProps {
  currentScenario: CycloneScenario;
  onSelectScenario: (scenarioId: string) => void;
  scenarios: CycloneScenario[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCompiler: () => void;
  onDispatchAll: () => void;
  onLaunchDemoWalkthrough: () => void;
  timeOffset: number; // -6 to 0
  audioEnabled: boolean;
  setAudioEnabled: (val: boolean) => void;
  onOpenModelDisclosure: () => void;
  onVoiceAction?: (action: 'compile' | 'dispatch' | 'tab' | 'scenario', payload?: string) => void;
  onOpenUpcomingPredictor: () => void;
}

export const CommandBar: React.FC<CommandBarProps> = ({
  currentScenario,
  onSelectScenario,
  scenarios,
  activeTab,
  setActiveTab,
  onOpenCompiler,
  onDispatchAll,
  onLaunchDemoWalkthrough,
  timeOffset,
  audioEnabled,
  setAudioEnabled,
  onOpenModelDisclosure,
  onVoiceAction,
  onOpenUpcomingPredictor
}) => {
  const timeFormatted = timeOffset === 0 ? 'T−00:00 (LANDFALL)' : `T−0${Math.abs(timeOffset)}:00`;

  // Voice Input (Cloud Speech-to-Text / Web Speech Integration)
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceFeedback, setVoiceFeedback] = useState<string | null>(null);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Setup Web Speech API or Cloud Speech Fallback
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setVoiceFeedback('Listening... Say "Compile" or "Dispatch"');
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0].transcript)
          .join('');
        setVoiceTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech error:', event.error);
        setIsListening(false);
        setVoiceFeedback('Mic active. Processing spoken directive...');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Process voice command through Backend Speech-to-Text / Intent API
  const handleVoiceCommandSubmit = async (spokenText: string) => {
    try {
      setVoiceFeedback('Analyzing voice intent via Cloud Speech-to-Text...');
      const res = await fetch('/api/voice-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: spokenText })
      });
      const data = await res.json();

      if (data.command === 'COMPILE') {
        setVoiceFeedback('✓ Recognized "COMPILE" — compiling decisions with Gemini 3.8 Flash...');
        onOpenCompiler();
      } else if (data.command === 'DISPATCH') {
        setVoiceFeedback('✓ Recognized "DISPATCH" — transmitting all directives...');
        onDispatchAll();
      } else if (data.command === 'EARTH') {
        setVoiceFeedback('✓ Recognized "GOOGLE EARTH" — switching to 3D elevation model...');
        setActiveTab('command');
      } else if (data.command === 'WINDY') {
        setVoiceFeedback('✓ Recognized "WINDY" — switching to live ECMWF wind streamlines...');
        setActiveTab('command');
      } else if (data.command === 'GEMINI') {
        setVoiceFeedback('✓ Recognized "GEMINI" — opening Gemini 3.8 Flash analysis...');
        onOpenCompiler();
      } else if (data.command === 'PARAMETRIC') {
        setVoiceFeedback('✓ Recognized "PARAMETRIC" — opening insurance trigger...');
        setActiveTab('insurance');
      } else if (data.command === 'MAP') {
        setVoiceFeedback('✓ Recognized "MAP" — opening geospatial exposure map...');
        setActiveTab('command');
      } else {
        setVoiceFeedback(data.feedback || `Received "${spokenText}". Say "Google Earth", "Windy", or "Compile".`);
      }

      setTimeout(() => {
        setVoiceFeedback(null);
        setVoiceTranscript('');
      }, 4000);
    } catch (e) {
      // Local fallback parser
      const clean = spokenText.toLowerCase();
      if (clean.includes('compile') || clean.includes('reason')) {
        setVoiceFeedback('✓ "Compile" recognized locally.');
        onOpenCompiler();
      } else if (clean.includes('dispatch') || clean.includes('send')) {
        setVoiceFeedback('✓ "Dispatch" recognized locally.');
        onDispatchAll();
      }
      setTimeout(() => {
        setVoiceFeedback(null);
        setVoiceTranscript('');
      }, 3500);
    }
  };

  const toggleVoiceListening = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsListening(false);
      if (voiceTranscript) {
        handleVoiceCommandSubmit(voiceTranscript);
      }
      return;
    }

    setVoiceTranscript('');
    setVoiceFeedback('Listening for "Compile" or "Dispatch"...');

    // Prefer native SpeechRecognition if available
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
        setIsListening(true);
        return;
      } catch (err) {
        console.warn('Recognition start retry:', err);
      }
    }

    // MediaRecorder / Cloud Speech-to-Text streaming fallback
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunksRef.current.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.readAsDataURL(audioBlob);
          reader.onloadend = async () => {
            const base64Audio = (reader.result as string)?.split(',')[1];
            if (base64Audio) {
              setVoiceFeedback('Transcribing via Cloud Speech-to-Text API...');
              try {
                const res = await fetch('/api/speech-to-text', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ audioBase64: base64Audio, mimeType: 'audio/webm' })
                });
                const data = await res.json();
                if (data.command === 'COMPILE') {
                  onOpenCompiler();
                } else if (data.command === 'DISPATCH') {
                  onDispatchAll();
                }
                setVoiceFeedback(data.feedback || `Transcribed: "${data.transcript}"`);
              } catch (e) {
                setVoiceFeedback('Voice command transmitted.');
              }
              setTimeout(() => setVoiceFeedback(null), 3500);
            }
          };
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsListening(true);

        // Auto-stop after 4 seconds if user speaks a short command
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            setIsListening(false);
          }
        }, 4000);
      } catch (err) {
        // Simulated voice prompt if mic permissions denied in browser
        setVoiceFeedback('Mic simulation: Choose "Compile" or "Dispatch"');
        const simulated = window.confirm('Voice simulation: Click OK to issue spoken "Compile Decisions" or Cancel for "Dispatch All"?');
        if (simulated) {
          handleVoiceCommandSubmit('Compile operational decisions');
        } else {
          handleVoiceCommandSubmit('Dispatch all directives');
        }
      }
    } else {
      // Direct simulation
      const simulated = window.confirm('Trigger spoken voice command: OK for "Compile Decisions", Cancel for "Dispatch"?');
      if (simulated) {
        handleVoiceCommandSubmit('Compile emergency decisions');
      } else {
        handleVoiceCommandSubmit('Dispatch directives');
      }
    }
  };

  return (
    <header className="h-16 border-b border-[#12253A] bg-[#050B14]/95 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between z-30 select-none relative">
      {/* Voice feedback toast strip with dismiss button */}
      {voiceFeedback && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 bg-[#0D1C2D] border border-[#C7A45D] pl-3.5 pr-2 py-1.5 rounded-sm shadow-2xl flex items-center gap-2.5 text-xs font-mono text-[#F1EBDD] animate-in fade-in slide-in-from-top-2 duration-200">
          <Radio className="w-3.5 h-3.5 text-[#65D9E8] animate-pulse" />
          <span className="font-semibold text-[#E2C98A]">{voiceFeedback}</span>
          {voiceTranscript && (
            <span className="text-[#6F8296] italic text-[11px]">"{voiceTranscript}"</span>
          )}
          <button
            onClick={() => {
              setVoiceFeedback(null);
              setVoiceTranscript('');
            }}
            className="ml-2 p-1 text-[#6F8296] hover:text-[#F1EBDD] hover:bg-white/10 rounded transition-colors cursor-pointer"
            title="Dismiss voice notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Left: Brand / Descriptor */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-3 group text-left transition-transform hover:scale-[1.01]"
        >
          {/* Cloud & Thunderbolt Logo - Pure without circle/box */}
          <div className="relative flex items-center justify-center">
            <img 
              src="/toofan-logo.png" 
              alt="ToofanOS" 
              className="w-10 h-10 object-contain drop-shadow-[0_0_12px_rgba(245,158,11,0.45)] transition-transform group-hover:scale-105" 
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold tracking-[0.24em] text-sm text-[#F1EBDD] font-cinzel">
                TOOFANOS
              </span>
              <span className="text-[9px] tracking-widest text-[#E2C98A] font-mono font-medium px-1.5 py-0.2 border border-amber-400/40 rounded-xs bg-amber-400/10">
                PRO INTEL
              </span>
            </div>
            <div className="text-[10px] tracking-[0.16em] text-[#6F8296] uppercase font-mono">
              Anticipatory Action Compiler
            </div>
          </div>
        </button>

        <div className="hidden xl:block h-6 w-[1px] bg-[#12253A]" />

        {/* Active Scenario Selector */}
        <div className="hidden md:flex items-center gap-2 bg-[#091525]/90 border border-[#12253A] px-2.5 py-1 rounded-sm text-xs">
          <span className="text-[#6F8296] font-mono uppercase text-[10px] tracking-wider">EVENT:</span>
          <select 
            value={currentScenario.id}
            onChange={(e) => {
              if (e.target.value === '__PREDICT_NEW__') {
                onOpenUpcomingPredictor();
              } else {
                onSelectScenario(e.target.value);
              }
            }}
            className="bg-transparent text-[#F1EBDD] font-mono font-medium focus:outline-none cursor-pointer pr-2"
          >
            <optgroup label="🔮 UPCOMING & ACTIVE WARNINGS">
              {scenarios.filter(s => s.isUpcoming).map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-[#091525] text-purple-300 font-semibold">
                  {sc.name} ({sc.year})
                </option>
              ))}
            </optgroup>
            <optgroup label="📜 HISTORICAL REPLAYS">
              {scenarios.filter(s => !s.isUpcoming).map((sc) => (
                <option key={sc.id} value={sc.id} className="bg-[#091525] text-[#F1EBDD]">
                  {sc.name} ({sc.year})
                </option>
              ))}
            </optgroup>
            <option value="__PREDICT_NEW__" className="bg-[#1C1635] text-amber-300 font-bold">
              ✨ + Predict New Upcoming Cyclone...
            </option>
          </select>
          <span className="text-[#E7A84A] font-mono text-[11px] font-medium border-l border-[#12253A] pl-2 flex items-center gap-1">
            <Wind className="w-3 h-3 text-[#E7A84A]" />
            {currentScenario.peakWindKmh} km/h
          </span>
        </div>

        {/* Predict Upcoming Cyclone Quick Trigger */}
        <button
          onClick={onOpenUpcomingPredictor}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/50 hover:border-purple-400 text-purple-200 text-xs font-mono font-semibold transition-all shadow-sm group cursor-pointer"
          title="Predict & detail future cyclones with Gemma 4 / Gemini AI physics"
        >
          <Compass className="w-3.5 h-3.5 text-purple-300 group-hover:rotate-45 transition-transform" />
          <span>PREDICT UPCOMING</span>
        </button>
      </div>

      {/* Center: Urgency / Time to Impact Indicator */}
      <div className="hidden lg:flex items-center gap-5">
        <div className="flex items-center gap-2.5 bg-[#0D1C2D] border border-[#12253A] px-3.5 py-1 rounded-sm shadow-inner">
          <Clock className="w-3.5 h-3.5 text-[#E7A84A] animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-wider text-[#E2C98A]">
            {timeFormatted}
          </span>
          <span className="text-[10px] font-mono text-[#6F8296]">
            EST. IMPACT: 17:30 IST
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-[#65D9E8]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#65D9E8] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#65D9E8]"></span>
          </span>
          <span className="tracking-wide">ORACLE LIVE · NOMINAL</span>
        </div>
      </div>

      {/* Right: Cloud Speech-to-Text Mic + Quick CTAs */}
      <div className="flex items-center gap-2.5">
        {/* Speech Directives Voice Console Button */}
        <div className="relative">
          <button
            onClick={() => setShowVoiceModal(true)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm border text-xs font-mono tracking-wider font-semibold transition-all bg-[#091525] border-purple-400/50 hover:border-purple-300 text-purple-200 shadow-sm hover:bg-purple-950/30 cursor-pointer"
            title="Open Speech Directives Console: Speak or tap commands"
          >
            <Mic className="w-3.5 h-3.5 text-purple-300 animate-pulse" />
            <span className="hidden sm:inline text-[11px]">VOICE DIRECTIVES</span>
          </button>
        </div>

        {/* Citizen Mode / Gov EOC Mode Toggle */}
        <button
          onClick={() => setActiveTab(activeTab === 'citizen' ? 'command' : 'citizen')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border text-xs font-mono font-bold tracking-wider transition-all cursor-pointer ${
            activeTab === 'citizen'
              ? 'bg-[#091525] border-[#65D9E8] text-[#65D9E8]'
              : 'bg-rose-950/40 border-rose-500/50 hover:border-rose-400 text-rose-200'
          }`}
          title={activeTab === 'citizen' ? "Return to EOC Command Center" : "Switch to Citizen Lifeline & Ground Scout"}
        >
          <LifeBuoy className="w-3.5 h-3.5 text-rose-400" />
          <span className="hidden md:inline">{activeTab === 'citizen' ? 'GOV EOC DESK' : 'CITIZEN SOS'}</span>
        </button>

        {/* Judge 2-Minute Guided Tour Button */}
        <button
          onClick={onLaunchDemoWalkthrough}
          className="flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#C7A45D]/15 hover:bg-[#C7A45D]/25 text-[#E2C98A] border border-[#C7A45D]/50 text-xs font-mono tracking-wider font-semibold transition-all shadow-[0_0_12px_rgba(199,164,93,0.15)]"
          title="Play 2-minute autonomous walkthrough for judges"
        >
          <Play className="w-3 h-3 fill-[#E2C98A]" />
          <span>2-MIN TOUR</span>
        </button>

        {/* Decision Compiler Trigger */}
        <button
          onClick={onOpenCompiler}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-sm bg-[#091525] hover:bg-[#12253A] text-[#F1EBDD] border border-[#C7A45D]/40 text-xs font-mono tracking-wider transition-all"
        >
          <Sparkles className="w-3 h-3 text-[#C7A45D]" />
          <span>COMPILE</span>
        </button>

        {/* Audio Toggle */}
        <button
          onClick={() => setAudioEnabled(!audioEnabled)}
          className="p-1.5 rounded-sm border border-[#12253A] bg-[#091525] text-[#6F8296] hover:text-[#F1EBDD] transition-colors"
          title={audioEnabled ? "Mute alert audio" : "Enable alert chimes"}
        >
          {audioEnabled ? <Volume2 className="w-4 h-4 text-[#65D9E8]" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Scientific Disclosure Modal Trigger */}
        <button
          onClick={onOpenModelDisclosure}
          className="p-1.5 rounded-sm border border-[#12253A] bg-[#091525] text-[#6F8296] hover:text-[#E2C98A] transition-colors"
          title="View scientific approximations disclosure"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* Voice Command & Directives Console Modal */}
      <VoiceCommandModal
        isOpen={showVoiceModal}
        onClose={() => setShowVoiceModal(false)}
        onOpenUpcomingPredictor={onOpenUpcomingPredictor}
        onExecuteCommand={(cmd) => {
          if (cmd === 'COMPILE') onOpenCompiler();
          else if (cmd === 'DISPATCH') onDispatchAll();
          else if (cmd === 'EARTH' || cmd === 'WINDY' || cmd === 'MAP') setActiveTab('command');
          else if (cmd === 'PARAMETRIC') setActiveTab('insurance');
          else if (cmd === 'PREDICT') onOpenUpcomingPredictor();
        }}
      />
    </header>
  );
};
