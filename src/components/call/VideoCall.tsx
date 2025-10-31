import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { StreamVideoClient, Call } from "@stream-io/video-react-sdk";
import {
  StreamCall,
  StreamVideo,
  StreamTheme,
  CallControls,
  SpeakerLayout,
} from "@stream-io/video-react-sdk";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { useAuth } from "../providers/auth";
import { useStreamVideo } from "./StreamVideoProvider";

type ParticipantNames = Record<string, string> | undefined;

interface VideoCallProps {
  callId: string;
  className?: string;
  autoJoin?: boolean;
  onCallStateChange?: (state: { isInCall: boolean }) => void;
  participantNames?: ParticipantNames;
  user?: any;
}

function VideoCall({
  callId,
  className = "",
  autoJoin = true,
  onCallStateChange,
  user: userProp,
}: VideoCallProps) {
  const { client, isReady, error } = useStreamVideo();
  const [call, setCall] = useState<Call | null>(null);
  const [isJoining, setIsJoining] = useState<boolean>(false);
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const mountedRef = useRef<boolean>(false);
  const joiningRef = useRef<boolean>(false);
  const callRef = useRef<Call | null>(null);

  // prefer prop -> auth context -> localStorage
  const { user: authUser } = useAuth();
  const user = useMemo(() => {
    if (userProp) return userProp;
    if (authUser) return authUser;
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, [authUser, userProp]);

  const setupClient = useCallback(async () => {
    if (!user || !user.id || mountedRef.current) return null;
    mountedRef.current = true;
    try {
      return client;
    } catch (e) {
      console.error(e);
      toast.error("Failed to initialize video client");
      return null;
    }
  }, [client, user]);

  const getOrCreateVideoCall = useCallback(
    async (c: StreamVideoClient) => {
      if (call) return call;
      const newCall = c.call("development", callId);
      await newCall.getOrCreate({
        data: {
          custom: {
            room_type: "video",
            should_ring: false,
            start_call_video: true,
            audio_only: false,
            auto_enable_video: true,
          },
        },
      });
      setCall(newCall);
      return newCall;
    },
    [call, callId]
  );

  const joinCall = useCallback(
    async (newCall: Call) => {
      try {
        if (joiningRef.current || isJoined) return;
        joiningRef.current = true;
        setIsJoining(true);
        await newCall.join({ create: false });
        await newCall.camera?.enable();
        await newCall.microphone?.enable();
        onCallStateChange?.({ isInCall: true });
        setIsJoined(true);
      } catch (e) {
        console.error(e);
        toast.error("Failed to join video call");
      } finally {
        setIsJoining(false);
        joiningRef.current = false;
      }
    },
    [isJoined, onCallStateChange]
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!isReady || error) return;
      const c = client || (await setupClient());
      if (!c || cancelled) return;
      const created = await getOrCreateVideoCall(c);
      if (autoJoin && created && !cancelled && !isJoined) {
        await joinCall(created);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [autoJoin, client, getOrCreateVideoCall, joinCall, setupClient, isReady, error, isJoined]);

  // Keep a ref of the current call
  useEffect(() => {
    callRef.current = call;
  }, [call]);

  // Cleanup on unmount only
  useEffect(() => {
    return () => {
      try {
        callRef.current?.leave();
      } catch {}
      onCallStateChange?.({ isInCall: false });
    };
  }, []);

  // Track join/leave via call events to keep UI in sync
  useEffect(() => {
    if (!call) return;
    const handleJoined = () => setIsJoined(true);
    const handleLeft = () => setIsJoined(false);
    // @ts-ignore - event names come from SDK
    call.on('call.joined', handleJoined);
    // @ts-ignore
    call.on('call.left', handleLeft);
    return () => {
      // @ts-ignore
      call.off('call.joined', handleJoined);
      // @ts-ignore
      call.off('call.left', handleLeft);
    };
  }, [call]);

  if (!isReady || error) {
    return (
      <div className={className}>
        <div className="p-4 text-sm">{error || 'Initializing video...'}</div>
      </div>
    );
  }

  if (!client || !call) {
    return (
      <div className={className}>
        <div className="p-4 text-sm">Preparing video call...</div>
      </div>
    );
  }

  return (
    <div className={className}>
      <StreamVideo client={client}>
        <StreamCall call={call}>
          <StreamTheme>
            <div className="flex flex-col w-full">
              <div className="flex-1 min-h-[240px]">
                <SpeakerLayout />
              </div>
              <div className="border-t">
                <CallControls onLeave={() => call?.leave()} />
              </div>
            </div>
          </StreamTheme>
        </StreamCall>
      </StreamVideo>
      <div className="p-2 flex justify-end">
        {isJoining && !isJoined && (
          <Button variant="secondary" disabled>
            Joining...
          </Button>
        )}
      </div>
    </div>
  );
}

export default memo(VideoCall);


