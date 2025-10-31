import Chat from "@/components/chat/Chat";
// removed unused Dock imports
import Member from "@/components/member";
import Navbar from "@/components/Nav_bar";
import { useAuth } from "@/components/providers/auth";
import Session from "@/components/session/Session";
import { SessionTimer } from "@/components/session/SessionTimer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/contexts/SessionContext";
import { deleteGroup, getGroupdetails, leaveGroup } from "@/lib/group-api";
// removed unused cn import
import { GroupData } from "@/type";
import { motion } from "framer-motion";
import {
  Calendar,
  MessageSquare,
  // removed unused PenTool
  Users,
  Star,
  TrendingUp,
  Clock3,
  Palette,
  Lightbulb
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router";
import { AIChatButton } from "@/components/chat/AIChatButton";
import { AIChatDialog } from "@/components/chat/AIChatDialog";
import { Whiteboard } from "@/components/whiteboard";
import Diagram from "@/components/Diagram";

const quickActions = [
  { id: "members", icon: Users, label: "Team", color: "bg-blue-500", description: "View all members" },
  { id: "chat", icon: MessageSquare, label: "Chat", color: "bg-green-500", description: "Join discussion" },
  { id: "sessions", icon: Clock3, label: "Sessions", color: "bg-purple-500", description: "Study together" },
  { id: "whiteboard", icon: Palette, label: "Board", color: "bg-orange-500", description: "Collaborate visually" },
  { id: "diagram", icon: Lightbulb, label: "AI Tools", color: "bg-pink-500", description: "Generate diagrams" },
];

const defaultGroupData: GroupData = {
  id: "",
  name: "",
  subject: "",
  description: undefined,
  code: "",
  creatorId: "",
  memberIds: [],
  createdAt: new Date().toISOString(),
  creator: { id: "", name: "", email: "", avatarUrl: undefined },
  members: [],
  messages: [],
  sessions: [],
};

export default function StudyGroupPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [groupData, setGroupData] = useState(defaultGroupData);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  const { groupId } = useParams();
  const { user } = useAuth();
  const id = user?.id;
  const navigate = useNavigate();
  const isOwner = groupData.creatorId === id;
  const { activeSessions, endSession, leaveSession } = useSession();

  useEffect(() => {
    async function fetchGroupData() {
      setIsLoading(true);
      try {
        if (groupId) {
          const data: GroupData = await getGroupdetails(groupId);
          setGroupData(data);
        }
      } catch (error) {
        console.error("Error fetching group data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGroupData();
  }, [groupId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10">
      <Navbar />

      {/* Session Timers */}
      {activeSessions.length > 0 &&
        activeSessions.map((session) => (
          <SessionTimer
            key={session.id}
            session={session}
            onClose={() => endSession(session.id)}
            onLeave={() => leaveSession(session.id)}
            currentUserId={user?.id || ""}
          />
        ))}

      <div className="pt-20 px-6 pb-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Cards Row */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Group Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-8"
            >
              <Card className="h-full bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
                <CardHeader className="pb-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      <Skeleton className="h-8 w-2/3" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16 border-2 border-primary/20">
                          <AvatarImage src={groupData.creator.avatarUrl} />
                          <AvatarFallback className="text-xl">
                            {groupData.creator.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h1 className="text-3xl font-bold text-foreground mb-1">
                            {groupData.name}
                          </h1>
                          <p className="text-lg text-muted-foreground mb-2">
                            {groupData.subject}
                          </p>
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {groupData.members?.length || 0} members
                            </Badge>
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              Active
                            </Badge>
                          </div>
                        </div>
                      </div>
                      {/* removed non-functional menu button */}
                    </div>
                  )}
                </CardHeader>
                {!isLoading && (
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      {groupData.description || "Welcome to our study group! Let's learn together."}
                    </p>
                    {/* removed non-functional quick action buttons */}
                  </CardContent>
                )}
              </Card>
            </motion.div>

            {/* Stats Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-4"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Group Stats
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Messages</span>
                      <span className="font-semibold">{groupData.messages?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Sessions</span>
                      <span className="font-semibold">{groupData.sessions?.length || 0}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Created</span>
                      <span className="font-semibold text-xs">
                        {new Date(groupData.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Quick Actions Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              {/* kept simple title without extra non-functional CTA */}
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {quickActions.map((action, index) => (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className={cn(
                      "cursor-pointer transition-all hover:shadow-lg border-2",
                      activeTab === action.id
                        ? "border-primary bg-primary/5"
                        : "border-transparent hover:border-primary/20"
                    )}
                    onClick={() => setActiveTab(action.id)}
                  >
                    <CardContent className="p-4 text-center">
                      <div className={cn("w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center", action.color)}>
                        <action.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="font-semibold mb-1">{action.label}</h3>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="min-h-[600px]">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {quickActions.find(a => a.id === activeTab)?.icon && (
                        <div className={cn("p-2 rounded-lg", quickActions.find(a => a.id === activeTab)?.color)}>
                          {React.createElement(quickActions.find(a => a.id === activeTab)?.icon!, { className: "h-4 w-4 text-white" })}
                        </div>
                      )}
                      {quickActions.find(a => a.id === activeTab)?.label || "Dashboard"}
                    </CardTitle>
                    <CardDescription>
                      {quickActions.find(a => a.id === activeTab)?.description || "Main dashboard"}
                    </CardDescription>
                  </div>
                  {/* removed non-functional header actions */}
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {activeTab === "dashboard" && (
                  <div className="space-y-6">
                    <div className="text-center py-12">
                      <h3 className="text-2xl font-semibold mb-2">Welcome to {groupData.name}</h3>
                      <p className="text-muted-foreground mb-6">
                        Choose an action above to get started with your study group.
                      </p>
                      <div className="flex justify-center gap-4">
                        <Button onClick={() => setActiveTab("chat")}>
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Start Chatting
                        </Button>
                        <Button variant="outline" onClick={() => setActiveTab("sessions")}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Session
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
                {isLoading && activeTab !== "dashboard" ? (
                  <div className="space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-64 w-full" />
                  </div>
                ) : (
                  <>
                    {activeTab === "members" && <Member groupData={groupData} />}
                    {activeTab === "chat" && groupId && <Chat groupId={groupId} />}
                    {activeTab === "sessions" && <Session />}
                    {activeTab === "whiteboard" && <Whiteboard />}
                    {activeTab === "diagram" && <Diagram />}
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-8"
          >
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">Group Actions:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("sessions")}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      View All Sessions
                    </Button>
                    {/* removed non-functional start session button */}
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        {isOwner ? "Delete Group" : "Leave Group"}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          {isOwner ? "Delete Group" : "Leave Group"}
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={async () => {
                            if (isOwner) await deleteGroup(groupData.id);
                            else await leaveGroup(groupData.id);
                            navigate("/groups");
                          }}
                        >
                          {isOwner ? "Delete" : "Leave"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <AIChatButton
        onClick={() => setIsAIChatOpen(true)}
        isOpen={isAIChatOpen}
      />
      <AIChatDialog
        isOpen={isAIChatOpen}
        onClose={() => setIsAIChatOpen(false)}
      />
    </div>
  );
}
