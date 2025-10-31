import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { StreamVideoClient } from '@stream-io/video-react-sdk';
import { initializeVideoClient, disconnectClient } from './StreamClient';
import { useAuth } from '../providers/auth';
import { toast } from 'sonner';

type StreamVideoContextValue = {
  client: StreamVideoClient | null;
  isReady: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const StreamVideoContext = createContext<StreamVideoContextValue | undefined>(undefined);

export const StreamVideoProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const initInFlightRef = useRef(false);
  const currentUserIdRef = useRef<string | null>(null);

  const initialize = useCallback(async () => {
    if (!user || !user.id) {
      setClient(null);
      setIsReady(false);
      setError(null);
      return;
    }
    if (initInFlightRef.current) return;
    initInFlightRef.current = true;
    try {
      // If user changed, disconnect previous client
      if (currentUserIdRef.current && currentUserIdRef.current !== user.id) {
        await disconnectClient(currentUserIdRef.current);
      }
      const c = await initializeVideoClient(user, true);
      currentUserIdRef.current = user.id;
      setClient(c);
      setIsReady(true);
      setError(null);
    } catch (e: any) {
      const msg = e?.message || 'Failed to initialize video client';
      setError(msg);
      setClient(null);
      setIsReady(false);
      toast.error(msg);
    } finally {
      initInFlightRef.current = false;
    }
  }, [user]);

  useEffect(() => {
    initialize();
    return () => {
      if (currentUserIdRef.current) {
        disconnectClient(currentUserIdRef.current).catch(() => {});
      }
      currentUserIdRef.current = null;
      setClient(null);
      setIsReady(false);
      setError(null);
    };
  }, [initialize]);

  const value = useMemo<StreamVideoContextValue>(() => ({
    client,
    isReady,
    error,
    refresh: initialize,
  }), [client, isReady, error, initialize]);

  return (
    <StreamVideoContext.Provider value={value}>
      {children}
    </StreamVideoContext.Provider>
  );
};

export const useStreamVideo = () => {
  const ctx = useContext(StreamVideoContext);
  if (!ctx) throw new Error('useStreamVideo must be used within StreamVideoProvider');
  return ctx;
};


