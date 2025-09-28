import React, { useState, useEffect, useRef } from 'react';
import { 
  StreamVideoClient, 
  Call, 
  StreamVideo, 
  StreamCall,
  CallControls,
  SpeakerLayout,
  useCall,
  useCallStateHooks
} from '@stream-io/video-react-sdk';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Mic, MicOff, Phone, PhoneOff, Users, Clock } from 'lucide-react';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import { transcribeAndSaveAudio } from '@/utils/audioTranscription';
import { useAuth } from '@/components/providers/auth';
import { toast } from 'sonner';
import '@stream-io/video-react-sdk/dist/css/styles.css';

interface AudioCallWithRecordingProps {
  groupId: string;
  sessionId?: string;
  callId: string;
  onEndCall?: () => void;
}

interface StreamTokenResponse {
  token: string;
  expiresAt: number;
}

// Component that uses GetStream call
const CallInterface: React.FC<{
  groupId: string;
  sessionId?: string;
  onEndCall?: () => void;
}> = ({ groupId, sessionId, onEndCall }) => {
  const call = useCall();
  const { useParticipants, useCallIngress, useCallEgress } = useCallStateHooks();
  const participants = useParticipants();
  const callIngress = useCallIngress();
  const callEgress = useCallEgress();
  
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [callStartTime, setCallStartTime] = useState<Date | null>(null);
  const [isProcessingRecording, setIsProcessingRecording] = useState(false);
  const { user } = useAuth();

  const {
    isRecording,
    startRecording,
    stopRecording,
    audioBlob,
    duration: recordingDuration,
    resetRecording,
    isSupported
  } = useAudioRecording();

  const handleJoinCall = async () => {
    if (!call) return;
    
    try {
      // Ensure the call is created if it doesn't exist yet
      await call.join({ create: true });
      setIsCallStarted(true);
      setCallStartTime(new Date());
      
      // Auto-start recording when call starts
      if (isSupported) {
        const started = await startRecording();
        if (started) {
          toast.success('Call recording started');
        } else {
          toast.error('Failed to start recording');
        }
      }
    } catch (error) {
      console.error('Error joining call:', error);
      toast.error('Failed to join call');
    }
  };

  const handleLeaveCall = async () => {
    if (!call) return;
    
    try {
      if (isRecording) {
        stopRecording();
      }
      
      await call.leave();
      setIsCallStarted(false);
      onEndCall?.();
    } catch (error) {
      console.error('Error leaving call:', error);
    }
  };

  // Process recording when it's available
  useEffect(() => {
    const processRecording = async () => {
      if (!audioBlob || !callStartTime || isProcessingRecording) return;
      
      setIsProcessingRecording(true);
      toast.info('Processing call recording...');
      
      try {
        const participantIds = participants.map(p => p.userId).filter(Boolean);
        const endTime = new Date();
        const callDuration = Math.floor((endTime.getTime() - callStartTime.getTime()) / 1000);
        
        const response = await transcribeAndSaveAudio({
          audioBlob,
          groupId,
          sessionId,
          duration: callDuration,
          participants: participantIds,
          startTime: callStartTime.toISOString(),
          endTime: endTime.toISOString(),
        });

        toast.success('Call summary generated successfully!');
        resetRecording();
      } catch (error) {
        console.error('Error processing recording:', error);
        toast.error('Failed to generate call summary');
      } finally {
        setIsProcessingRecording(false);
      }
    };

    processRecording();
  }, [audioBlob, callStartTime, groupId, sessionId, participants, isProcessingRecording, resetRecording]);

  if (!isSupported) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Audio recording is not supported in your browser. 
            Call summaries will not be available.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full h-full flex flex-col">
      {/* Call Status Bar */}
      <div className="bg-background border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant={isCallStarted ? "default" : "secondary"}>
              {isCallStarted ? "Call Active" : "Ready to Join"}
            </Badge>
            
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users size={16} />
              <span>{participants.length} participant{participants.length !== 1 ? 's' : ''}</span>
            </div>
            
            {isCallStarted && callStartTime && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock size={16} />
                <span>
                  {Math.floor((Date.now() - callStartTime.getTime()) / 60000)}m 
                  {Math.floor(((Date.now() - callStartTime.getTime()) % 60000) / 1000)}s
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={isRecording ? "destructive" : "outline"}>
              {isRecording ? (
                <>
                  <Mic size={12} className="mr-1" />
                  Recording
                </>
              ) : (
                <>
                  <MicOff size={12} className="mr-1" />
                  Not Recording
                </>
              )}
            </Badge>
            
            {isProcessingRecording && (
              <Badge variant="secondary">
                <Loader2 size={12} className="mr-1 animate-spin" />
                Processing...
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Call Interface */}
      <div className="flex-1 flex flex-col">
        {!isCallStarted ? (
          <div className="flex-1 flex items-center justify-center">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">Ready to Join Call</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-center text-muted-foreground">
                  Join the group discussion. The call will be automatically recorded 
                  and summarized for all participants.
                </p>
                <Button 
                  onClick={handleJoinCall} 
                  className="w-full" 
                  size="lg"
                >
                  <Phone className="mr-2" size={16} />
                  Join Call
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            {/* Video Layout */}
            <div className="flex-1">
              <SpeakerLayout participantsBarPosition="bottom" />
            </div>
            
            {/* Call Controls */}
            <div className="p-4 border-t">
              <div className="flex justify-center">
                <CallControls />
              </div>
              <div className="flex justify-center mt-4">
                <Button 
                  onClick={handleLeaveCall} 
                  variant="destructive" 
                  size="lg"
                >
                  <PhoneOff className="mr-2" size={16} />
                  Leave Call
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const AudioCallWithRecording: React.FC<AudioCallWithRecordingProps> = ({
  groupId,
  sessionId,
  callId,
  onEndCall
}) => {
  const [client, setClient] = useState<StreamVideoClient | null>(null);
  const [call, setCall] = useState<Call | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    let isMounted = true;

    const initializeCall = async () => {
      if (!user) return;

      try {
        // Get Stream token from backend
        const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3000';
        const response = await fetch(`${apiBase}/api/call/get-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to get Stream token');
        }

        const { token }: StreamTokenResponse = await response.json();

        // Initialize Stream client
        const streamClient = new StreamVideoClient({
          apiKey: import.meta.env.VITE_GETSTREAM_API_KEY,
          user: {
            id: user.id,
            name: user.name,
            image: user.avatarUrl,
          },
          token,
        });

        // Create or join call
        const streamCall = streamClient.call('default', callId);
        // Ensure the call exists server-side to avoid 404 on join
        try {
          await streamCall.getOrCreate({
            data: {
              members: [{ user_id: user.id, role: 'user' }],
              custom: { audio_only: true }
            }
          });
        } catch (e) {
          // If already exists, ignore
          console.warn('getOrCreate call issue (may already exist):', e);
        }

        if (isMounted) {
          setClient(streamClient);
          setCall(streamCall);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error initializing call:', error);
        toast.error('Failed to initialize call');
        setIsLoading(false);
      }
    };

    initializeCall();

    return () => {
      isMounted = false;
      if (client) {
        client.disconnectUser();
      }
    };
  }, [user, callId]);

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <Loader2 className="animate-spin" size={32} />
      </div>
    );
  }

  if (!client || !call || !user) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            Failed to initialize call. Please try again.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <StreamVideo client={client}>
      <StreamCall call={call}>
        <CallInterface
          groupId={groupId}
          sessionId={sessionId}
          onEndCall={onEndCall}
        />
      </StreamCall>
    </StreamVideo>
  );
};

export default AudioCallWithRecording;