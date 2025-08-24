import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Users, 
  BookOpen, 
  Sparkles,
  Grid3X3,
  Heart,
  Target,
  Brain,
  Trophy
} from "lucide-react";
import Navbar from "../components/Nav_bar";
import { useAuth } from "@/components/providers/auth";
import { CreateGroupDialog } from "../components/group/Create-group-dialog";
import { JoinGroupDialog } from "../components/group/join-group-dialog";
import { Group, JoinRequest } from "../type";
import { fetchGroups, getjoinRequest } from "../lib/group-api";
import { GroupSection } from "@/components/group/Group-section";
import { UserGroupSection } from "@/components/group/Users-group-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

  // ✅ Merge: Signed-out state with BrainHub + StudyWise message
  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex min-h-screen items-center justify-center bg-background p-4"
      >
        <MotionCard
          initial={{ scale: 0.9, rotateY: 15 }}
          animate={{ scale: 1, rotateY: 0 }}
          transition={{ type: "spring", duration: 0.7 }}
          className="w-96 text-center p-8 shadow-2xl border border-primary/20 bg-background"
        >
          <motion.div
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", duration: 0.8, delay: 0.3 }}
            className="w-20 h-20 mx-auto mb-6 bg-gradient-to-tr from-primary via-primary/80 to-primary/60 rounded-2xl flex items-center justify-center shadow-lg"
          >
            <Brain className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
            BrainHub
          </h2>

        </MotionCard>
      </motion.div>
    );
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 mt-16">
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-8"
        >
          {/* ✅ Header */}
          <motion.div variants={item}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* Welcome Card */}
              <Card className="lg:col-span-2 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground border-0 shadow-xl">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-4xl font-bold mb-2">BrainHub</h1>
                      <p className="text-primary-foreground/80 text-lg flex items-center gap-2">
                        <Sparkles className="h-5 w-5" />
                        Welcome back, <span className="font-semibold">{user?.name || "Scholar"}</span>!
                        <Sparkles className="h-5 w-5" />
                      </p>
                      <p className="text-primary-foreground/60 text-sm mt-2">
                        Your intelligent learning companion
                      </p>
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <Brain className="w-12 h-12 text-primary-foreground/20" />
                    </motion.div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <CreateGroupDialog
                      onCreateGroup={(newGroup) =>
                        setCreatedGroups((prevGroups) => [...prevGroups, newGroup])
                      }
                    />
                    <JoinGroupDialog />
                  </div>
                </CardContent>
              </Card>

              {/* Clock */}
              <Card className="bg-background border border-border shadow-xl">
                <CardContent className="p-6">
                  <BeautifulIndianClock />
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* ✅ Stats */}
          <motion.div variants={item}>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={<Users className="w-5 h-5" />}
                label="Created Groups"
                value={createdGroups.length}
                color="primary"
                description="Your groups"
              />
              <StatCard
                icon={<Heart className="w-5 h-5" />}
                label="Joined Groups"
                value={memberGroups.length}
                color="rose"
                description="Member of"
              />
              <StatCard
                icon={<BookOpen className="w-5 h-5" />}
                label="Pending Requests"
                value={request.length}
                color="amber"
                description="Invitations"
              />
              <StatCard
                icon={<Trophy className="w-5 h-5" />}
                label="Total Groups"
                value={createdGroups.length + memberGroups.length}
                color="emerald"
                description="Network"
              />
            </div>
          </motion.div>

          {/* ✅ Search + Tabs */}
          <motion.div variants={item}>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
              <Card className="lg:col-span-3 bg-background border border-border shadow-lg">
                <CardContent className="p-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <Input
                      type="text"
                      placeholder="Search groups..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 bg-transparent border-0 text-lg focus:ring-0 focus-visible:ring-0"
                    />
                  </div>
                </CardContent>
              </Card>

              <div className="lg:col-span-2 flex gap-2">
                <MasonryTabButton
                  active={activeTab === "all"}
                  onClick={() => setActiveTab("all")}
                  icon={<Grid3X3 className="w-4 h-4" />}
                >
                  All Groups
                </MasonryTabButton>
                <MasonryTabButton
                  active={activeTab === "created"}
                  onClick={() => setActiveTab("created")}
                  icon={<Target className="w-4 h-4" />}
                >
                  Created Groups
                </MasonryTabButton>
                <MasonryTabButton
                  active={activeTab === "joined"}
                  onClick={() => setActiveTab("joined")}
                  icon={<Heart className="w-4 h-4" />}
                >
                  Joined Groups
                </MasonryTabButton>
              </div>
            </div>
          </motion.div>

          {/* ✅ Groups */}
          <div className="space-y-8">
            {(activeTab === "all" || activeTab === "created") && (
              <motion.div variants={item}>
                <MasonryContentSection
                  title="Your Leadership Groups"
                  subtitle="Communities where you guide and inspire"
                  count={filteredCreatedGroups.length}
                  icon={<Target className="w-6 h-6 text-primary" />}
                  gradient="from-primary/10 to-primary/5"
                >
                  <UserGroupSection
                    title=""
                    groups={filteredCreatedGroups}
                    isLoading={isLoading}
                    error={error}
                    request={request}
                    setRequest={setRequest}
                  />
                </MasonryContentSection>
              </motion.div>
            )}

            {(activeTab === "all" || activeTab === "joined") && (
              <motion.div variants={item}>
                <MasonryContentSection
                  title="Active Memberships"
                  subtitle="Communities where you learn and contribute"
                  count={filteredMemberGroups.length}
                  icon={<Heart className="w-6 h-6 text-rose-500" />}
                  gradient="from-rose-500/10 to-rose-500/5"
                >
                  <GroupSection
                    title=""
                    groups={filteredMemberGroups}
                    isLoading={isLoading}
                    error={error}
                    isOwner={false}
                  />
                </MasonryContentSection>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ---- StatCard (same) ---- */
const StatCard = ({
  icon,
  label,
  value,
  color,
  description,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  description: string;
}) => {
  const colorClasses = {
    primary: "bg-primary text-primary-foreground",
    rose: "bg-rose-500 text-white",
    amber: "bg-amber-500 text-white",
    emerald: "bg-emerald-500 text-white",
  };

  return (
    <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
      <Card className="bg-background border border-border shadow-lg hover:shadow-xl transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${colorClasses[color as keyof typeof colorClasses]}`}>
              {icon}
            </div>
            <span className="text-2xl font-bold text-foreground">{value}</span>
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

/* ---- Tabs with animated underline ---- */
const MasonryTabButton = ({
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
  <Button
    variant="ghost"
    onClick={onClick}
    className={`relative flex-1 px-4 py-2 transition-all duration-200 ${
      active
        ? "text-primary font-medium"
        : "text-muted-foreground hover:text-primary"
    }`}
  >
    <div className="flex items-center space-x-2">{icon}<span>{children}</span></div>
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
      />
    )}
  </Button>
);

/* ---- Section ---- */
const MasonryContentSection = ({
  title,
  subtitle,
  count,
  icon,
  gradient,
  children,
}: {
  title: string;
  subtitle: string;
  count: number;
  icon: React.ReactNode;
  gradient: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-6">
    <Card className={`bg-gradient-to-r ${gradient} border border-border shadow-lg`}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-background rounded-xl shadow-sm">
              {icon}
            </div>
            <div>
              <CardTitle className="text-xl text-foreground">{title}</CardTitle>
              <p className="text-muted-foreground mt-1">{subtitle}</p>
            </div>
          </div>
          <div className="bg-background/80 px-4 py-2 rounded-full">
            <span className="font-bold text-foreground">{count}</span>
          </div>
        </div>
      </CardHeader>
    </Card>
    
    <Card className="bg-background border border-border shadow-lg">
      <CardContent className="p-6">
        {children}
      </CardContent>
    </Card>
  </div>
);
