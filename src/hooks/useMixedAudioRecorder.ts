import { useCallback, useRef, useState } from "react";

export interface MixedRecorderState {
  isRecording: boolean;
  duration: number;
  audioUrl: string | null;
  audioBlob: Blob | null;
}

export interface UseMixedAudioRecorderResult extends MixedRecorderState {
  start: (inputStream: MediaStream, mimeType?: string) => Promise<void>;
  stop: () => void;
  reset: () => void;
}

export function useMixedAudioRecorder(): UseMixedAudioRecorderResult {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  const start = useCallback(async (inputStream: MediaStream, mimeType = "audio/webm") => {
    if (!inputStream) return;
    try {
      // Some browsers require tracks to be live
      const hasAudio = inputStream.getAudioTracks().length > 0;
      if (!hasAudio) throw new Error("Input stream has no audio tracks");

      // Stop any previous instance
      if (mediaRecorderRef.current && isRecording) {
        try { mediaRecorderRef.current.stop(); } catch {}
      }

      chunksRef.current = [];
      setAudioUrl(null);
      setAudioBlob(null);

      const options: MediaRecorderOptions = {} as MediaRecorderOptions;
      if (MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(mimeType)) {
        options.mimeType = mimeType as any;
      }

      const recorder = new MediaRecorder(inputStream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e: BlobEvent) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: options.mimeType || mimeType });
        setAudioBlob(blob);
        setAudioUrl(URL.createObjectURL(blob));
        chunksRef.current = [];
      };

      recorder.start(250); // small timeslice to collect data progressively
      setIsRecording(true);
      setDuration(0);
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = window.setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000) as unknown as number;
    } catch (err) {
      console.error("Failed to start mixed recording:", err);
    }
  }, [isRecording]);

  const stop = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      try { mediaRecorderRef.current.stop(); } catch {}
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsRecording(false);
    }
  }, [isRecording]);

  const reset = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      try { mediaRecorderRef.current.stop(); } catch {}
    }
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsRecording(false);
    setDuration(0);
    setAudioUrl(null);
    setAudioBlob(null);
    chunksRef.current = [];
  }, [isRecording]);

  return { isRecording, duration, audioUrl, audioBlob, start, stop, reset };
}


