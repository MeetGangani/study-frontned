import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Phone, 
  MessageSquare, 
  Users, 
  History,
  Settings,
  Mic,
  Video,
  PhoneCall
} from 'lucide-react';
import AudioCallWithRecording from './AudioCallWithRecording';
import CallSummariesList from './CallSummariesList';

interface GroupDiscussionPageProps {
  groupId: string;
  groupName: string;
  sessionId?: string;
  sessionName?: string;
  isGroupMember: boolean;
}

const GroupDiscussionPage: React.FC<GroupDiscussionPageProps> = ({
  groupId,
  groupName,
  sessionId,
  sessionName,
  isGroupMember
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCallActive, setIsCallActive] = useState(false);
  const [callId] = useState(`${groupId}-${Date.now()}`); // Generate unique call ID

  const handleStartCall = () => {
    setIsCallActive(true);
    setActiveTab('call');
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setActiveTab('overview');
  };

  if (!isGroupMember) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            You need to be a member of this group to access group discussions.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{groupName}</h1>
            {sessionName && (
              <p className="text-lg text-muted-foreground mt-1">
                Session: {sessionName}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <Badge variant={isCallActive ? "default" : "secondary"}>
              {isCallActive ? "Call Active" : "Ready to Start"}
            </Badge>
            
            {!isCallActive && (
              <Button onClick={handleStartCall} size="lg">
                <PhoneCall className="mr-2" size={20} />
                Start Discussion
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Users size={16} />
            Overview
          </TabsTrigger>
          <TabsTrigger value="call" className="flex items-center gap-2">
            <Phone size={16} />
            Call
            {isCallActive && <Badge variant="destructive" className="ml-2 h-5">Live</Badge>}
          </TabsTrigger>
          <TabsTrigger value="summaries" className="flex items-center gap-2">
            <MessageSquare size={16} />
            Summaries
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings size={16} />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Quick Start Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone size={20} />
                  Group Discussion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Start a voice discussion with your group members. All calls are 
                  automatically recorded and summarized using AI.
                </p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Mic size={14} className="text-green-600" />
                    <span>Auto-recording enabled</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MessageSquare size={14} className="text-blue-600" />
                    <span>AI-powered summaries</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <History size={14} className="text-purple-600" />
                    <span>Full conversation history</span>
                  </div>
                </div>
                
                <Button onClick={handleStartCall} className="w-full" size="lg">
                  <PhoneCall className="mr-2" size={16} />
                  Start Group Discussion
                </Button>
              </CardContent>
            </Card>

            {/* Recent Summaries Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History size={20} />
                  Recent Summaries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CallSummariesList groupId={groupId} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="call" className="mt-6">
          {isCallActive ? (
            <div className="w-full h-[600px]">
              <AudioCallWithRecording
                groupId={groupId}
                sessionId={sessionId}
                callId={callId}
                onEndCall={handleEndCall}
              />
            </div>
          ) : (
            <Card className="w-full max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-center">No Active Call</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Start a group discussion to use the call interface.
                </p>
                <Button onClick={handleStartCall} size="lg">
                  <PhoneCall className="mr-2" size={16} />
                  Start Discussion
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="summaries" className="mt-6">
          <CallSummariesList groupId={groupId} />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Discussion Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Recording Options</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Auto-start recording</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Generate AI summaries</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Save full transcripts</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Audio Quality</h4>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>Echo cancellation</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Noise suppression</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auto gain control</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Privacy</h4>
                  <p className="text-sm text-muted-foreground">
                    All recordings and summaries are stored securely and only 
                    accessible to group members. Recordings are automatically 
                    processed and the original audio files are not permanently stored.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GroupDiscussionPage;