import React from "react";
import { useDiscussionRecorder } from "../hooks/useDiscussionRecorder";

const apiBaseUrl = import.meta.env.VITE_API_URL as string;

export function DiscussionRecorder() {
  const {
    isRecording,
    isUploading,
    transcript,
    summary,
    error,
    start,
    stopAndUpload,
  } = useDiscussionRecorder(apiBaseUrl);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 8 }}>
        {!isRecording ? (
          <button onClick={start} disabled={isUploading}>
            Start Recording
          </button>
        ) : (
          <button onClick={stopAndUpload} disabled={isUploading}>
            Stop & Upload
          </button>
        )}
      </div>

      {isUploading && <div>Uploading & Transcribing...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}

      {transcript && (
        <div>
          <h3>Transcript</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{transcript}</pre>
        </div>
      )}

      {summary && (
        <div>
          <h3>Summary</h3>
          <pre style={{ whiteSpace: "pre-wrap" }}>{summary}</pre>
        </div>
      )}
    </div>
  );
}
