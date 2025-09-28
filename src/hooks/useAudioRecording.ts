import { useState, useRef, useCallback } from 'react';

interface AudioRecordingState {
  isRecording: boolean;
  audioURL: string | null;
  audioBlob: Blob | null;
  duration: number;
}

interface UseAudioRecordingReturn extends AudioRecordingState {
  startRecording: () => Promise<boolean>;
  stopRecording: () => void;
  resetRecording: () => void;
  isSupported: boolean;
}

export const useAudioRecording = (): UseAudioRecordingReturn => {
  const [state, setState] = useState<AudioRecordingState>({
    isRecording: false,
    audioURL: null,
    audioBlob: null,
    duration: 0,
  });

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const startTimeRef = useRef<number>(0);
  const chunksRef = useRef<Blob[]>([]);

  const isSupported = typeof navigator !== 'undefined' && 
                     navigator.mediaDevices && 
                     navigator.mediaDevices.getUserMedia &&
                     typeof MediaRecorder !== 'undefined';

  const startRecording = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      console.error('Audio recording is not supported in this browser');
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      });

      chunksRef.current = [];
      mediaRecorderRef.current = mediaRecorder;
      startTimeRef.current = Date.now();

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const duration = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm;codecs=opus' });
        const audioURL = URL.createObjectURL(audioBlob);

        setState(prev => ({
          ...prev,
          isRecording: false,
          audioURL,
          audioBlob,
          duration,
        }));

        // Clean up stream
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every 1 second

      setState(prev => ({
        ...prev,
        isRecording: true,
        audioURL: null,
        audioBlob: null,
        duration: 0,
      }));

      return true;
    } catch (error) {
      console.error('Error starting recording:', error);
      return false;
    }
  }, [isSupported]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && state.isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [state.isRecording]);

  const resetRecording = useCallback(() => {
    if (state.audioURL) {
      URL.revokeObjectURL(state.audioURL);
    }
    
    setState({
      isRecording: false,
      audioURL: null,
      audioBlob: null,
      duration: 0,
    });
    
    chunksRef.current = [];
  }, [state.audioURL]);

  return {
    ...state,
    startRecording,
    stopRecording,
    resetRecording,
    isSupported,
  };
};