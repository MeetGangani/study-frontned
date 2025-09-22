import { useRef, useState } from "react";

export function useDiscussionRecorder(apiBaseUrl: string) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [summary, setSummary] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function start() {
    try {
      setError(null);
      setTranscript("");
      setSummary("");
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mimeType = "audio/webm;codecs=opus";
      const recorder = new MediaRecorder(stream, { mimeType });

      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        // No-op; uploading happens in stop()
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (e: any) {
      setError(e?.message || "Failed to start recording");
    }
  }

  async function stopAndUpload() {
    try {
      if (!mediaRecorderRef.current) return;
      setIsUploading(true);

      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Wait a tick to ensure ondataavailable fires
      await new Promise((r) => setTimeout(r, 200));

      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;

      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      chunksRef.current = [];

      const form = new FormData();
      form.append("audio", blob, "discussion.webm");

      const resp = await fetch(`${apiBaseUrl}/api/transcribe`, {
        method: "POST",
        body: form,
        credentials: "include",
      });

      if (!resp.ok) {
        const details = await resp.text();
        throw new Error(`Upload failed: ${details}`);
      }

      const data = await resp.json();
      setTranscript(data.transcript || "");
      setSummary(data.summary || "");
    } catch (e: any) {
      setError(e?.message || "Failed to upload");
    } finally {
      setIsUploading(false);
    }
  }

  return {
    isRecording,
    isUploading,
    transcript,
    summary,
    error,
    start,
    stopAndUpload,
  };
}
