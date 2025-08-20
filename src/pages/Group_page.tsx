import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, BookOpen, ArrowRight, Sparkles, Plus, Target, Award, Clock, TrendingUp, Star, Calendar, Filter, Grid3X3, List, ChevronDown, Bell } from "lucide-react";
import Navbar from "../components/Nav_bar";
import { useAuth } from "@/components/providers/auth";
import { CreateGroupDialog } from "../components/group/Create-group-dialog";
import { JoinGroupDialog } from "../components/group/join-group-dialog";
import { Group, JoinRequest } from "../type";
import { fetchGroups, getjoinRequest } from "../lib/group-api";
import { GroupSection } from "@/components/group/Group-section";
import { UserGroupSection } from "@/components/group/Users-group-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import BeautifulIndianClock from "@/components/IndianClock";

const MotionCard = motion(Card);

export default function GroupsPage() {
  const { user } = useAuth();
  const [createdGroups, setCreatedGroups] = useState<Group[]>([]);
  const [memberGroups, setMemberGroups] = useState<Group[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [request, setRequest] = useState<JoinRequest[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const loadGroups = async () => {
      if (!user) return;
      setIsLoading(true);
      setError(null);
      try {
        const { createdGroups, memberGroups } = await fetchGroups();
        const requests = await getjoinRequest();
        setCreatedGroups(createdGroups || []);
        setMemberGroups(memberGroups || []);
        setRequest(requests);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setError("Failed to load groups. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    loadGroups();
  }, [user]);

  const filteredCreatedGroups = createdGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const filteredMemberGroups = memberGroups.filter(
    (group) =>
      (group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        group.subject.toLowerCase().includes(searchTerm.toLowerCase())) &&
      user?.id !== group.creatorId
  );

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/10 flex items-center justify-center relative overflow-hidden">
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }} />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: 20 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10"
        >
          <Card className="w-[500px] bg-card/95 backdrop-blur-2xl border border-border/50 shadow-2xl">
            <CardHeader className="text-center pb-8">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", bounce: 0.5, duration: 1, delay: 0.2 }}
                className="mx-auto w-24 h-24 bg-gradient-to-br from-primary via-primary to-accent rounded-3xl flex items-center justify-center mb-6 shadow-lg"
              >
                <BookOpen className="w-12 h-12 text-white" />
              </motion.div>
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                StudyWise Hub
              </CardTitle>
              <p className="text-muted-foreground text-lg mt-2">Your Gateway to Collaborative Learning</p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                <div className="h-1 w-20 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"></div>
                <p className="text-muted-foreground">Please sign in to access your study groups and start learning with others</p>
                <div className="flex justify-center space-x-2 mt-6">
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const totalGroups = createdGroups.length + memberGroups.length;
  const todayDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />

      {/* Dynamic Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute w-[600px] h-[600px] bg-gradient-to-r from-primary/8 to-accent/8 rounded-full blur-3xl transition-all duration-1000"
          style={{
            left: mousePosition.x - 300,
            top: mousePosition.y - 300,
          }}
        />
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 pt-20">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="container mx-auto px-6 py-8 max-w-7xl"
        >
          {/* Top Bar */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-8">
            <div className="flex-1">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl lg:text-5xl font-bold text-foreground mb-2"
              >
                Welcome back, 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent ml-2">
                  {user?.name?.split(' ')[0] || "Scholar"}!
                </span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="text-muted-foreground text-lg flex items-center"
              >
                <Calendar className="w-5 h-5 mr-2" />
                {todayDate}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center space-x-4 mt-4 lg:mt-0"
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm">
                <Star className="w-4 h-4 mr-2" />
                Level 5 Learner
              </Badge>
              <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <BeautifulIndianClock />
              </div>
            </motion.div>
          </div>

          {/* Stats Dashboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          >
            <DashboardCard
              title="Total Groups"
              value={totalGroups}
              subtitle={`${createdGroups.length} created • ${memberGroups.length} joined`}
              icon={<Users className="w-8 h-8" />}
              gradient="from-blue-500 to-cyan-500"
              delay={0}
            />
            <DashboardCard
              title="Study Streak"
              value="12"
              subtitle="Days in a row"
              icon={<TrendingUp className="w-8 h-8" />}
              gradient="from-green-500 to-emerald-500"
              delay={0.1}
            />
            <DashboardCard
              title="Hours Studied"
              value="47"
              subtitle="This month"
              icon={<Clock className="w-8 h-8" />}
              gradient="from-purple-500 to-violet-500"
              delay={0.2}
            />
            <DashboardCard
              title="Pending Invites"
              value={request.length}
              subtitle="Waiting for response"
              icon={<Bell className="w-8 h-8" />}
              gradient="from-orange-500 to-red-500"
              delay={0.3}
            />
          </motion.div>

          {/* Quick Actions Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-xl border border-border/50 shadow-2xl mb-8">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Sparkles className="w-6 h-6 mr-3 text-primary" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ActionCard
                  icon={<Plus className="w-6 h-6" />}
                  title="Create New Group"
                  description="Start a new study group"
                  gradient="from-primary/10 to-primary/5"
                  action={
                    <CreateGroupDialog
                      onCreateGroup={(newGroup) =>
                        setCreatedGroups((prevGroups) => [...prevGroups, newGroup])
                      }
                    />
                  }
                />
                <ActionCard
                  icon={<Users className="w-6 h-6" />}
                  title="Join Group"
                  description="Join an existing group"
                  gradient="from-accent/10 to-accent/5"
                  action={<JoinGroupDialog />}
                />
                <ActionCard
                  icon={<Search className="w-6 h-6" />}
                  title="Discover Groups"
                  description="Find public study groups"
                  gradient="from-green-500/10 to-green-500/5"
                  action={
                    <Button variant="outline" className="w-full">
                      Browse Groups
                    </Button>
                  }
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Search & Filter Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border border-border/50 shadow-lg mb-8">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row items-center gap-4">
                  {/* Search Bar */}
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                    <Input
                      type="text"
                      placeholder="Search groups by name or subject..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 pr-4 h-12 text-base bg-background/70 border-0 shadow-inner focus:ring-2 focus:ring-primary/20"
                    />
                  </div>

                  <Separator orientation="vertical" className="h-8 hidden lg:block" />

                  {/* Tab Filters */}
                  <div className="flex items-center bg-muted/30 rounded-xl p-1">
                    <TabButton active={activeTab === "all"} onClick={() => setActiveTab("all")}>
                      All ({totalGroups})
                    </TabButton>
                    <TabButton active={activeTab === "created"} onClick={() => setActiveTab("created")}>
                      Created ({createdGroups.length})
                    </TabButton>
                    <TabButton active={activeTab === "joined"} onClick={() => setActiveTab("joined")}>
                      Joined ({memberGroups.length})
                    </TabButton>
                  </div>

                  <Separator orientation="vertical" className="h-8 hidden lg:block" />

                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-muted/30 rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Filter Button */}
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Filter className="w-4 h-4" />
                    Filters
                    <ChevronDown className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Groups Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-8"
          >
            {(activeTab === "all" || activeTab === "created") && (
              <GroupsSection
                title="Your Created Groups"
                description="Study groups you've created and manage"
                count={filteredCreatedGroups.length}
                color="text-primary"
              >
                <UserGroupSection
                  title=""
                  groups={filteredCreatedGroups}
                  isLoading={isLoading}
                  error={error}
                  request={request}
                  setRequest={setRequest}
                />
              </GroupsSection>
            )}

            {(activeTab === "all" || activeTab === "joined") && (
              <GroupsSection
                title="Joined Groups"
                description="Study groups you're a member of"
                count={filteredMemberGroups.length}
                color="text-accent-foreground"
              >
                <GroupSection
                  title=""
                  groups={filteredMemberGroups}
                  isLoading={isLoading}
                  error={error}
                  isOwner={false}
                />
              </GroupsSection>
            )}

            {/* Enhanced Empty State */}
            {!isLoading && filteredCreatedGroups.length === 0 && filteredMemberGroups.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <Card className="max-w-md mx-auto bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
                  <CardContent className="p-12">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                      <BookOpen className="w-10 h-10 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-4">
                      {searchTerm ? "No groups found" : "Ready to start learning?"}
                    </h3>
                    <p className="text-muted-foreground mb-8">
                      {searchTerm 
                        ? "Try adjusting your search terms or browse all available groups" 
                        : "Create your first study group or join an existing one to begin your collaborative learning journey"
                      }
                    </p>
                    {!searchTerm && (
                      <div className="space-y-3">
                        <CreateGroupDialog
                          onCreateGroup={(newGroup) =>
                            setCreatedGroups((prevGroups) => [...prevGroups, newGroup])
                          }
                        />
                        <JoinGroupDialog />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

// Dashboard Card Component
const DashboardCard = ({ title, value, subtitle, icon, gradient, delay }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  gradient: string;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{ delay, type: "spring", stiffness: 100 }}
    whileHover={{ y: -5, scale: 1.02 }}
    className="group"
  >
    <Card className="bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden">
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-3xl`}></div>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg group-hover:scale-110 transition-transform`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-foreground">{value}</div>
            <div className="text-sm text-muted-foreground">{title}</div>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        <div className={`mt-3 h-1 bg-gradient-to-r ${gradient} rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
      </CardContent>
    </Card>
  </motion.div>
);

// Action Card Component
const ActionCard = ({ icon, title, description, gradient, action }: {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  action: React.ReactNode;
}) => (
  <motion.div whileHover={{ scale: 1.02, y: -2 }} className="group">
    <Card className={`bg-gradient-to-br ${gradient} border border-border/30 hover:border-primary/30 transition-all duration-300 h-full`}>
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-primary/10 rounded-lg mr-3">
            {icon}
          </div>
          <div>
            <h4 className="font-semibold text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        {action}
      </CardContent>
    </Card>
  </motion.div>
);

// Groups Section Component
const GroupsSection = ({ title, description, count, color, children }: {
  title: string;
  description: string;
  count: number;
  color: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-foreground flex items-center">
          <div className={`w-1 h-8 ${color.replace('text-', 'bg-')} rounded-full mr-4`}></div>
          {title}
          <Badge variant="secondary" className="ml-3">
            {count}
          </Badge>
        </h2>
        <p className="text-muted-foreground mt-1 ml-5">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

// Tab Button Component
const TabButton = ({ children, active, onClick }: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
      active
        ? "bg-primary text-primary-foreground shadow-md"
        : "text-muted-foreground hover:text-foreground hover:bg-background/50"
    }`}
  >
    {children}
  </motion.button>
);
