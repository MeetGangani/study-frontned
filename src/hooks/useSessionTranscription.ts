import { useEffect, useRef, useState } from "react";

// Merge helper: append "addition" to "base" while removing any overlapping word suffix/prefix
function appendWithWordOverlap(base: string, addition: string): string {
  const trimmedBase = base.trim();
  const trimmedAddition = addition.trim();
  if (!trimmedBase) return trimmedAddition;
  if (!trimmedAddition) return trimmedBase;

  const baseWords = trimmedBase.split(/\s+/);
  const addWords = trimmedAddition.split(/\s+/);

  // Limit overlap window to last 20 words to keep it efficient and meaningful
  const maxOverlap = Math.min(20, baseWords.length, addWords.length);
  let overlapSize = 0;

  for (let k = maxOverlap; k > 0; k--) {
    const baseSuffix = baseWords.slice(-k).join(" ").toLowerCase();
    const addPrefix = addWords.slice(0, k).join(" ").toLowerCase();
    if (baseSuffix === addPrefix) {
      overlapSize = k;
      break;
    }
  }

  const nonOverlappingTail = overlapSize > 0 ? addWords.slice(overlapSize).join(" ") : trimmedAddition;
  return nonOverlappingTail ? `${trimmedBase} ${nonOverlappingTail}`.trim() : trimmedBase;
}

interface UseSessionTranscriptionOptions {
  sessionId: string;
  lang?: string; // e.g. "en-US"
  enabled: boolean; // whether to run recognition
  flushIntervalMs?: number; // how often to send accumulated transcript
}

export function useSessionTranscription({
  sessionId,
  lang = "en-US",
  enabled,
  flushIntervalMs = 10000,
}: UseSessionTranscriptionOptions) {
  const [isSupported, setIsSupported] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const bufferRef = useRef<string>("");
  const interimRef = useRef<string>("");
  const flushTimerRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);
  const restartTimerRef = useRef<number | null>(null);
  const lastCommittedRef = useRef<string>("");

  useEffect(() => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) setIsSupported(true);
  }, []);

  useEffect(() => {
    if (!enabled || !isSupported) {
      stop();
      return;
    }
    start();
    return stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, isSupported, lang, sessionId]);

  async function flushBuffer() {
    // Merge the latest interim safely to avoid duplicating words already committed
    if (interimRef.current) {
      bufferRef.current = appendWithWordOverlap(bufferRef.current, interimRef.current);
      interimRef.current = "";
    }
    const text = bufferRef.current.trim();
    if (!text) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sessions/${sessionId}/transcript`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ transcript: text, lang }),
      });
      if (!res.ok) throw new Error("Failed to upload transcript");
      bufferRef.current = "";
    } catch (e) {
      // keep buffer; try next flush
      // no-op
    }
  }

  function start() {
    if (isRunning) return;
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec: any = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = lang;
    rec.maxAlternatives = 1;
    rec.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0]?.transcript || "";
        if (result.isFinal) {
          // Append final text using overlap-aware merge to prevent echoes like "hello hello"
          bufferRef.current = appendWithWordOverlap(bufferRef.current, text);
          lastCommittedRef.current = bufferRef.current;
        } else {
          interim += text;
        }
      }
      // keep latest interim separately
      interimRef.current = interim.trim();
    };
    rec.onerror = () => {
      // attempt restart on errors
      try { rec.stop(); } catch {}
      if (enabled) {
        try { rec.start(); } catch {}
      }
    };
    rec.onend = () => {
      if (enabled) {
        try { rec.start(); } catch {}
      }
    };
    try {
      rec.start();
      recognitionRef.current = rec;
      setIsRunning(true);
      // set up periodic flush
      if (flushTimerRef.current) window.clearInterval(flushTimerRef.current);
      flushTimerRef.current = window.setInterval(() => {
        flushBuffer();
      }, flushIntervalMs) as unknown as number;
      // Chrome sometimes degrades after long runs; force periodic restart
      if (restartTimerRef.current) window.clearInterval(restartTimerRef.current);
      restartTimerRef.current = window.setInterval(() => {
        try { rec.stop(); } catch {}
      }, 60000) as unknown as number; // restart every 60s
    } catch (e) {
      // failed to start
    }
  }

  function stop() {
    if (flushTimerRef.current) {
      window.clearInterval(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    if (restartTimerRef.current) {
      window.clearInterval(restartTimerRef.current);
      restartTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.onend = null; recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    // flush any remaining
    void flushBuffer();
    setIsRunning(false);
  }

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        // flush when tab is hidden
        void flushBuffer();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("beforeunload", flushBuffer);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("beforeunload", flushBuffer as any);
    };
  }, []);

  return { isSupported, isRunning, start, stop };
}


