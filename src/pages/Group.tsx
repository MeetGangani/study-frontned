import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Users, BookOpen, ArrowRight, Sparkles, Plus, Target, Award } from "lucide-react";
import Navbar from "../components/Nav_bar";
import { useAuth } from "@/components/providers/auth";
import { CreateGroupDialog } from "../components/group/Create-group-dialog";
import { JoinGroupDialog } from "../components/group/join-group-dialog";
import { Group, JoinRequest } from "../type";
import { fetchGroups, getjoinRequest } from "../lib/group-api";
import { GroupSection } from "@/components/group/Group-section";
import { UserGroupSection } from "@/components/group/Users-group-section";
import { Card, CardContent } from "@/components/ui/card";
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
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl animate-bounce" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex min-h-screen items-center justify-center p-4"
        >
          <MotionCard
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-96 text-center p-12 shadow-2xl border border-border/50 bg-card/80 backdrop-blur-xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", duration: 0.8, delay: 0.3 }}
              className="relative"
            >
              <div className="mx-auto h-20 w-20 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mb-8 shadow-lg">
                <BookOpen className="h-10 w-10 text-primary-foreground" />
              </div>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-4xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent"
            >
              Welcome to StudyWise
            </motion.h2>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="space-y-4"
            >
              <p className="text-muted-foreground text-lg">
                Your Gateway to Collaborative Learning
              </p>
              <div className="h-1 w-24 bg-gradient-to-r from-primary to-accent rounded-full mx-auto"></div>
              <p className="text-sm text-muted-foreground">
                Please sign in to access your study groups
              </p>
            </motion.div>
          </MotionCard>
        </motion.div>
      </div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 30, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 100
      }
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden">
      
      {/* Enhanced Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div 
          className="absolute w-96 h-96 bg-primary/15 rounded-full blur-3xl transition-all duration-700 ease-out"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
        <div 
          className="absolute w-64 h-64 bg-primary/20 rounded-full blur-2xl transition-all duration-500 ease-out"
          style={{
            left: mousePosition.x - 128,
            top: mousePosition.y - 128,
          }}
        />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-float" />
        <div className="absolute top-3/4 left-3/4 w-32 h-32 bg-accent/15 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <Navbar />
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="container mx-auto px-6 py-12 mt-16 space-y-12 relative z-10 max-w-7xl"
      >
        
        {/* Enhanced Hero Section */}
        <motion.div variants={item} className="text-center space-y-8">
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-sm font-medium border border-primary/20 backdrop-blur-sm"
            >
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
              StudyWise Learning Hub
              <div className="ml-2 w-2 h-2 bg-primary rounded-full animate-ping"></div>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-6xl md:text-7xl font-extrabold leading-tight"
            >
              <span className="text-foreground">Welcome to</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent animate-gradient-x">
                StudyWise Hub
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Collaborate, Learn, and Grow Together
            </motion.p>

            <motion.div
              variants={item}
              className="flex items-center justify-center gap-3 text-2xl font-medium text-primary bg-primary/5 backdrop-blur-sm rounded-2xl px-8 py-4 border border-primary/20 max-w-fit mx-auto"
            >
              <Sparkles className="h-6 w-6 animate-pulse" />
              <span>Welcome back, {user?.name || "Scholar"}!</span>
              <Sparkles className="h-6 w-6 animate-pulse" />
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Clock Section */}
        <motion.div 
          variants={item}
          className="flex justify-center"
        >
          <div className="max-w-md mx-auto p-8 bg-card/50 backdrop-blur-sm rounded-3xl border border-border/50 shadow-2xl">
            <BeautifulIndianClock />
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        <motion.div
          variants={item}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto"
        >
          <EnhancedStatsCard
            icon={<Users className="h-7 w-7" />}
            label="Created Groups"
            value={createdGroups.length}
            gradient="from-primary/10 to-primary/5"
            iconBg="bg-primary/10"
            iconColor="text-primary"
            trend="+12%"
          />
          <EnhancedStatsCard
            icon={<BookOpen className="h-7 w-7" />}
            label="Joined Groups"
            value={memberGroups.length}
            gradient="from-accent/10 to-accent/5"
            iconBg="bg-accent/10"
            iconColor="text-accent-foreground"
            trend="+8%"
          />
          <EnhancedStatsCard
            icon={<ArrowRight className="h-7 w-7" />}
            label="Pending Requests"
            value={request.length}
            gradient="from-destructive/10 to-destructive/5"
            iconBg="bg-destructive/10"
            iconColor="text-destructive"
            trend="New"
          />
          <EnhancedStatsCard
            icon={<Award className="h-7 w-7" />}
            label="Study Streak"
            value={15}
            gradient="from-yellow-500/10 to-orange-500/5"
            iconBg="bg-yellow-500/10"
            iconColor="text-yellow-600"
            trend="+3 days"
          />
        </motion.div>

        {/* Enhanced Actions and Search Bar - FIXED */}
        <motion.div
          variants={item}
          className="max-w-screen-xl mx-auto space-y-8"
        >
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Fixed CreateGroupDialog usage */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <CreateGroupDialog
                  onCreateGroup={(newGroup) =>
                    setCreatedGroups((prevGroups) => [...prevGroups, newGroup])
                  }
                />
              </motion.div>
              
              {/* Fixed JoinGroupDialog usage */}
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <JoinGroupDialog />
              </motion.div>
            </div>

            <div className="relative w-full lg:w-80">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10">
                <Search className="text-muted-foreground h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="Search groups by name or subject..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-3 w-full bg-card/50 backdrop-blur-sm border-border/50 rounded-2xl text-lg shadow-lg hover:shadow-xl transition-all focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                <kbd className="px-2 py-1 text-xs bg-muted rounded text-muted-foreground">⌘K</kbd>
              </div>
            </div>
          </div>

          {/* Enhanced Tab Navigation */}
          <div className="flex justify-center">
            <div className="flex gap-2 bg-card/50 backdrop-blur-sm rounded-2xl p-2 border border-border/50 shadow-lg">
              <EnhancedTabButton
                active={activeTab === "all"}
                onClick={() => setActiveTab("all")}
                icon={<Target className="h-4 w-4" />}
              >
                All Groups
              </EnhancedTabButton>
              <EnhancedTabButton
                active={activeTab === "created"}
                onClick={() => setActiveTab("created")}
                icon={<Users className="h-4 w-4" />}
              >
                Created Groups
              </EnhancedTabButton>
              <EnhancedTabButton
                active={activeTab === "joined"}
                onClick={() => setActiveTab("joined")}
                icon={<BookOpen className="h-4 w-4" />}
              >
                Joined Groups
              </EnhancedTabButton>
            </div>
          </div>
        </motion.div>

        <div className="mx-auto flex max-w-screen-xl flex-wrap items-center justify-between p-2">
          {/* Groups Display - FIXED COMPARISON OPERATORS */}
          <motion.div variants={item} className="space-y-12 w-full">
            {(activeTab === "all" || activeTab === "created") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <UserGroupSection
                  title="Your Created Groups"
                  groups={filteredCreatedGroups}
                  isLoading={isLoading}
                  error={error}
                  request={request}
                  setRequest={setRequest}
                />
              </motion.div>
            )}
            {(activeTab === "all" || activeTab === "joined") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <GroupSection
                  title="Groups You're a Member Of"
                  groups={filteredMemberGroups}
                  isLoading={isLoading}
                  error={error}
                  isOwner={false}
                />
              </motion.div>
            )}

            {/* Empty State */}
            {!isLoading && filteredCreatedGroups.length === 0 && filteredMemberGroups.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full flex items-center justify-center">
                  <BookOpen className="w-16 h-16 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">No groups found</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  {searchTerm ? "Try adjusting your search terms" : "Start your learning journey by creating or joining a group"}
                </p>
                {!searchTerm && (
                  <div className="flex items-center justify-center space-x-4">
                    <CreateGroupDialog
                      onCreateGroup={(newGroup) =>
                        setCreatedGroups((prevGroups) => [...prevGroups, newGroup])
                      }
                    />
                    <JoinGroupDialog />
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>

      <style>
        {`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        `}
      </style>
    </div>
  );
}

// Enhanced Stats Card Component
const EnhancedStatsCard = ({
  icon,
  label,
  value,
  gradient,
  iconBg,
  iconColor,
  trend,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  gradient: string;
  iconBg: string;
  iconColor: string;
  trend: string;
}) => (
  <motion.div 
    whileHover={{ scale: 1.05, y: -5 }} 
    whileTap={{ scale: 0.95 }}
    className="group cursor-pointer"
  >
    <Card className={`bg-gradient-to-br ${gradient} border border-border/50 shadow-xl hover:shadow-2xl transition-all duration-300 backdrop-blur-sm relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <CardContent className="p-6 relative">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${iconBg} rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
            <div className={iconColor}>{icon}</div>
          </div>
          <div className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">
            {trend}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground font-medium">{label}</p>
          <p className="text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
            {value}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
      </CardContent>
    </Card>
  </motion.div>
);

// Enhanced Tab Button Component
const EnhancedTabButton = ({
  children,
  active,
  onClick,
  icon,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
}) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
      active
        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
    }`}
    onClick={onClick}
  >
    {icon}
    {children}
    {active && (
      <motion.div
        layoutId="activeTabIndicator"
        className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl opacity-10"
      />
    )}
  </motion.button>
);
