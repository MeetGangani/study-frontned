import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface TranscriptionRequest {
  audioBlob: Blob;
  groupId?: string;
  sessionId?: string;
  duration?: number;
  participants?: string[];
  startTime?: string;
  endTime?: string;
}

export interface TranscriptionResponse {
  transcript: string;
  summary: string;
  savedSummary?: any;
  message?: string;
}

export interface CallSummary {
  id: string;
  groupId: string;
  sessionId: string | null;
  transcript: string;
  summary: string;
  duration: number;
  participants: string[];
  startTime: string;
  endTime: string;
  createdAt: string;
  session?: {
    id: string;
    name: string;
  };
}

export const transcribeAndSaveAudio = async (
  request: TranscriptionRequest,
  token?: string
): Promise<TranscriptionResponse> => {
  const formData = new FormData();
  formData.append('audio', request.audioBlob);
  
  if (request.groupId) formData.append('groupId', request.groupId);
  if (request.sessionId) formData.append('sessionId', request.sessionId);
  if (request.duration) formData.append('duration', request.duration.toString());
  if (request.participants) {
    formData.append('participants', JSON.stringify(request.participants));
  }
  if (request.startTime) formData.append('startTime', request.startTime);
  if (request.endTime) formData.append('endTime', request.endTime);

  const headers: Record<string, string> = {
    'Content-Type': 'multipart/form-data',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/transcribe-and-save`,
      formData,
      { headers, withCredentials: true }
    );

    return response.data;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
};

export const getCallSummaries = async (
  groupId: string,
  token?: string
): Promise<CallSummary[]> => {
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/call-summaries/${groupId}`,
      { headers, withCredentials: true }
    );

    return response.data.summaries;
  } catch (error) {
    console.error('Error fetching call summaries:', error);
    throw error;
  }
};

export const getCallSummary = async (
  summaryId: string,
  token?: string
): Promise<CallSummary> => {
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/call-summary/${summaryId}`,
      { headers, withCredentials: true }
    );

    return response.data.summary;
  } catch (error) {
    console.error('Error fetching call summary:', error);
    throw error;
  }
};