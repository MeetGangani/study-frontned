import { useEffect, useRef, useState } from "react";

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
  const flushTimerRef = useRef<number | null>(null);
  const recognitionRef = useRef<any>(null);

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
    rec.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          bufferRef.current += (bufferRef.current ? " " : "") + result[0].transcript;
        }
      }
    };
    rec.onend = () => {
      // auto-restart when enabled
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
    } catch (e) {
      // failed to start
    }
  }

  function stop() {
    if (flushTimerRef.current) {
      window.clearInterval(flushTimerRef.current);
      flushTimerRef.current = null;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.onend = null; recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    // flush any remaining
    void flushBuffer();
    setIsRunning(false);
  }

  return { isSupported, isRunning, start, stop };
}


