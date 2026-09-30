import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  X, 
  Sparkles, 
  Play, 
  Radio, 
  Activity, 
  CornerDownLeft, 
  Volume2, 
  AlertCircle,
  Compass,
  Zap,
  Send,
  Globe
} from 'lucide-react';

interface VoiceCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (command: string, rawText?: string) => void;
  onOpenUpcomingPredictor: () => void;
}

export const VoiceCommandModal: React.FC<VoiceCommandModalProps> = ({
  isOpen,
  onClose,
  onExecuteCommand,
  onOpenUpcomingPredictor
}) => {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string>('');
  const [manualInput, setManualInput] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('Ready for voice or typed directive');
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    if (!isOpen) {
      stopListening();
      return;
    }

    // Auto-start listening on modal open
    startListening();

    return () => {
      stopListening();
    };
  }, [isOpen]);

  const startListening = async () => {
    setMicError(null);
    setTranscript('');
    setStatusMessage('Listening... speak your directive clearly');

    // Try Browser Native SpeechRecognition first
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          const current = Array.from(event.results)
            .map((res: any) => res[0].transcript)
            .join('');
          setTranscript(current);
        };

        recognition.onerror = (err: any) => {
          console.warn('SpeechRecognition error:', err?.error);
          setIsListening(false);
          if (err.error === 'not-allowed' || err.error === 'service-not-allowed') {
            setMicError('Microphone permission blocked by browser or preview iframe. You can tap quick directives below or type.');
          } else {
            // Fallback to MediaRecorder
            tryMediaRecorder();
          }
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
        return;
      } catch (e: any) {
        console.warn('SpeechRecognition init error:', e);
      }
    }

    // Fallback: MediaRecorder with Cloud Audio
    tryMediaRecorder();
  };

  const tryMediaRecorder = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setMicError('Audio device access is restricted in this environment. Use quick directive buttons or text.');
      return;
    }

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
          const base64Data = reader.result as string;
          setStatusMessage('Processing speech via Cloud Speech-to-Text API...');
          try {
            const res = await fetch('/api/speech-to-text', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ audioBase64: base64Data, mimeType: 'audio/webm' })
            });
            const data = await res.json();
            if (data.transcript) {
              setTranscript(data.transcript);
              handleProcessIntent(data.transcript, data.command);
            }
          } catch (e) {
            setStatusMessage('Voice captured. Use tactical buttons below.');
          }
        };
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);

      // Auto-stop after 4.5 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsListening(false);
        }
      }, 4500);
    } catch (err: any) {
      console.warn('Microphone getUserMedia error:', err);
      setIsListening(false);
      setMicError('Microphone not permitted in iframe sandbox. Quick speech directives available below.');
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {}
    }
    setIsListening(false);
  };

  const handleProcessIntent = (text: string, knownCommand?: string) => {
    const clean = text.toLowerCase().trim();
    let cmd = knownCommand;

    if (!cmd || cmd === 'UNKNOWN') {
      if (clean.includes('predict') || clean.includes('upcoming') || clean.includes('forecast') || clean.includes('future')) {
        cmd = 'PREDICT';
      } else if (clean.includes('compile') || clean.includes('reason') || clean.includes('synthesize')) {
        cmd = 'COMPILE';
      } else if (clean.includes('dispatch') || clean.includes('send') || clean.includes('orders')) {
        cmd = 'DISPATCH';
      } else if (clean.includes('earth') || clean.includes('elevation') || clean.includes('3d')) {
        cmd = 'EARTH';
      } else if (clean.includes('windy') || clean.includes('streamline') || clean.includes('wind')) {
        cmd = 'WINDY';
      } else if (clean.includes('parametric') || clean.includes('insurance') || clean.includes('payout')) {
        cmd = 'PARAMETRIC';
      } else if (clean.includes('map')) {
        cmd = 'MAP';
      }
    }

    if (cmd === 'PREDICT') {
      setStatusMessage('✓ Directive Recognized: Opening Upcoming Cyclone Predictor...');
      setTimeout(() => {
        onOpenUpcomingPredictor();
        onClose();
      }, 700);
    } else if (cmd) {
      setStatusMessage(`✓ Directive Recognized: Executing "${cmd}"...`);
      setTimeout(() => {
        onExecuteCommand(cmd, text);
        onClose();
      }, 700);
    } else {
      setStatusMessage(`Unrecognized directive: "${text}". Try one of the quick commands below.`);
    }
  };

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    handleProcessIntent(manualInput);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl rounded-2xl border border-[var(--glass-line)] shadow-2xl overflow-hidden text-[var(--ink)]"
        style={{
          background: 'linear-gradient(145deg, rgba(24, 20, 48, 0.96) 0%, rgba(13, 10, 28, 0.98) 100%)'
        }}
      >
        {/* Header */}
        <div className="p-5 border-b border-[var(--glass-line)] flex items-center justify-between bg-black/20">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
              isListening 
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse' 
                : 'bg-purple-500/20 border-purple-500/40 text-purple-300'
            }`}>
              <Mic className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white font-serif tracking-tight flex items-center gap-2">
                Speech Directives Console
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/10 text-white/80 uppercase">
                  Voice Engine
                </span>
              </h3>
              <p className="text-xs text-[var(--ink-soft)] mt-0.5">
                Speak or select operational directives for instant compiler dispatch.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[var(--ink-soft)] hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Visual Wave & Status */}
          <div className="flex flex-col items-center justify-center py-6 px-4 rounded-xl bg-black/40 border border-white/5 relative overflow-hidden text-center">
            {/* Animated Mic Pulse */}
            <div className="relative mb-3">
              <button
                type="button"
                onClick={isListening ? stopListening : startListening}
                className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all cursor-pointer shadow-xl ${
                  isListening
                    ? 'bg-rose-600/30 border-rose-500 text-rose-200 ring-8 ring-rose-500/20 scale-105'
                    : 'bg-purple-600/30 border-purple-400 text-purple-200 hover:bg-purple-600/40'
                }`}
              >
                {isListening ? (
                  <Mic className="w-8 h-8 animate-pulse text-rose-400" />
                ) : (
                  <MicOff className="w-8 h-8 text-[var(--ink-soft)]" />
                )}
              </button>
            </div>

            <div className="font-mono text-xs font-semibold text-white/90">
              {isListening ? 'LISTENING (SPEAK NOW)' : 'MICROPHONE STANDBY'}
            </div>

            <p className="text-xs text-purple-200/90 mt-1 max-w-sm font-sans">
              {transcript ? `"${transcript}"` : statusMessage}
            </p>

            {micError && (
              <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-left text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-400 mt-0.5" />
                <span>{micError}</span>
              </div>
            )}
          </div>

          {/* Quick Tactical Speech Directives */}
          <div>
            <div className="text-xs font-mono uppercase tracking-wider text-[var(--ink-soft)] mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-300" />
              Quick Tactical Voice Directives (Instant Execution)
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  onOpenUpcomingPredictor();
                  onClose();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-400 text-left text-purple-200 transition-all cursor-pointer group"
              >
                <Compass className="w-4 h-4 text-purple-300 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-bold text-white">"Predict Upcoming Cyclone"</div>
                  <div className="text-[10px] text-[var(--ink-soft)]">Genesis Early Warning</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onExecuteCommand('COMPILE');
                  onClose();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-400 text-left text-purple-200 transition-all cursor-pointer group"
              >
                <Zap className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-bold text-white">"Compile Decisions"</div>
                  <div className="text-[10px] text-[var(--ink-soft)]">Synthesize 3-Role Directives</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onExecuteCommand('DISPATCH');
                  onClose();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-400 text-left text-purple-200 transition-all cursor-pointer group"
              >
                <Send className="w-4 h-4 text-emerald-300 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-bold text-white">"Dispatch All Orders"</div>
                  <div className="text-[10px] text-[var(--ink-soft)]">Broadcast to Field Roles</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  onExecuteCommand('EARTH');
                  onClose();
                }}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-900/30 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-400 text-left text-purple-200 transition-all cursor-pointer group"
              >
                <Globe className="w-4 h-4 text-cyan-300 group-hover:scale-110 transition-transform" />
                <div>
                  <div className="font-bold text-white">"Google Earth 3D"</div>
                  <div className="text-[10px] text-[var(--ink-soft)]">Orbital Elevation Corridor</div>
                </div>
              </button>
            </div>
          </div>

          {/* Manual Text Directive Fallback */}
          <form onSubmit={handleSubmitManual} className="relative">
            <input
              type="text"
              placeholder="Or type voice directive: e.g. 'Predict upcoming cyclone', 'Dispatch', 'Windy'..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="w-full bg-[#1A1633] border border-[var(--glass-line)] rounded-xl pl-4 pr-10 py-2.5 text-xs text-white placeholder-[var(--ink-dim)] focus:outline-none focus:border-purple-400 font-mono shadow-inner"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white cursor-pointer transition-colors"
            >
              <CornerDownLeft className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
