import DeveloperSection from "@/components/DeveloperSection";
import { FeatureCard } from "@/components/feature-card";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/components/providers/auth";
import { Button } from "@/components/ui/button";
import LoadingScreen from "@/Loading";
import {
  BookOpen,
  BrainCircuit,
  Calendar,
  FileText,
  MessageSquare,
  PenTool,
  Rocket,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Zap,
  Globe,
  Shield,
  Play,
  TrendingUp,
  Award,
  Clock
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";

function Home() {
  const navigate = useNavigate();
  const { user, isLoading, isAuthenticated, login } = useAuth();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const testimonials = [
    { name: "Sarah Chen", role: "Computer Science Student", text: "This platform transformed how I study. Our group sessions are so much more productive now!", avatar: "SC", rating: 5 },
    { name: "Marcus Rodriguez", role: "Pre-Med Student", text: "The collaborative whiteboard feature helped us tackle complex chemistry problems together.", avatar: "MR", rating: 5 },
    { name: "Emily Thompson", role: "Business Major", text: "Scheduling study sessions has never been easier. We've improved our grades significantly.", avatar: "ET", rating: 5 }
  ];

  const stats = [
    { number: "50K+", label: "Active Students", icon: Users, trend: "+23%" },
    { number: "10K+", label: "Study Groups", icon: Globe, trend: "+45%" },
    { number: "95%", label: "Success Rate", icon: TrendingUp, trend: "+12%" },
    { number: "4.9/5", label: "User Rating", icon: Star, trend: "New" }
  ];

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/groups");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: any) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">

        {/* Animated Background Elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          {/* Main cursor follower - much brighter */}
          <div
            className="absolute w-96 h-96 bg-primary/10 rounded-full blur-3xl transition-all duration-700 ease-out"
            style={{
              left: mousePosition.x - 192,
              top: mousePosition.y - 192,
            }}
          />

          {/* Secondary cursor ring - adds extra glow */}
          <div
            className="absolute w-64 h-64 bg-primary/15 rounded-full blur-2xl transition-all duration-500 ease-out"
            style={{
              left: mousePosition.x - 128,
              top: mousePosition.y - 128,
            }}
          />

          {/* Small bright center */}
          <div
            className="absolute w-32 h-32 bg-primary/20 rounded-full blur-xl transition-all duration-300 ease-out"
            style={{
              left: mousePosition.x - 64,
              top: mousePosition.y - 64,
            }}
          />

          {/* Static background elements - keeping original */}
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary/10 rounded-full blur-2xl animate-bounce" style={{ animationDuration: '3s' }} />
        </div>




        {/* Hero Section */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] dark:opacity-[0.05]"></div>
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-accent/5"></div>
          </div>

          <div className="relative px-4 py-24 md:py-32">
            <div className="container mx-auto max-w-7xl">
              <div className="grid lg:grid-cols-2 gap-16 items-center">

                {/* Left Content */}
                <div className="space-y-8 animate-fade-in-up">
                  <div className="inline-flex items-center px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-accent/10 text-primary text-sm font-medium border border-primary/20 backdrop-blur-sm hover:scale-105 transition-transform cursor-pointer">
                    <Zap className="w-4 h-4 mr-2 animate-pulse" />
                    Join 50,000+ Students Worldwide
                    <div className="ml-2 w-2 h-2 bg-primary rounded-full animate-ping"></div>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight text-foreground">
                      Learn
                      <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent animate-gradient-x">
                        Smarter
                      </span>
                      Together
                    </h1>
                    {/* <div className="h-2 w-32 bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div> */}
                  </div>

                  <p className="text-xl text-muted-foreground leading-relaxed max-w-lg animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    Transform your study experience with AI-powered group learning,
                    real-time collaboration, and intelligent study planning.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <Button
                      size="lg"
                      className="group px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
                      onClick={login}
                    >
                      Start Learning Now
                      <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="group px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 hover:bg-muted hover:scale-[1.02] border-2 hover:border-primary/30 backdrop-blur-sm"
                    >
                      <Play className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                      Watch Demo
                    </Button>
                  </div>

                  {/* Enhanced Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pt-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
                    {stats.map((stat, index) => (
                      <div key={index} className="group relative p-4 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 hover:border-primary/30 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-2">
                          <stat.icon className="w-5 h-5 text-primary/70" />
                          <span className="text-xs font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">{stat.trend}</span>
                        </div>
                        <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform">{stat.number}</div>
                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Visual - Enhanced */}
                <div className="relative animate-fade-in" style={{ animationDelay: '0.3s' }}>
                  <div className="relative z-10 bg-card/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-border/50 hover:border-primary/20 transition-all duration-500 group">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    <div className="relative space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-card-foreground">Advanced Calculus Group</h3>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            Next session in 2 hours
                          </p>
                        </div>
                        <div className="flex -space-x-2">
                          {[
                            { bg: "bg-primary", initial: "A" },
                            { bg: "bg-accent", initial: "B" },
                            { bg: "bg-secondary", initial: "C" },
                          ].map((avatar, i) => (
                            <div key={i} className={`w-10 h-10 rounded-full ${avatar.bg} border-2 border-card flex items-center justify-center text-white text-sm font-medium hover:scale-110 transition-transform cursor-pointer`}>
                              {avatar.initial}
                            </div>
                          ))}
                          <div className="w-10 h-10 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs text-muted-foreground hover:scale-110 transition-transform cursor-pointer">
                            +5
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {[
                          { completed: true, text: "Chapter 12: Integration Techniques", progress: 100 },
                          { completed: true, text: "Practice Problems Set A", progress: 100 },
                          { completed: false, text: "Final Exam Prep Session", progress: 60 }
                        ].map((task, index) => (
                          <div key={index} className="group/task hover:bg-muted/30 p-3 rounded-xl transition-all">
                            <div className="flex items-center space-x-3">
                              {task.completed ? (
                                <CheckCircle className="w-5 h-5 text-primary animate-pulse" />
                              ) : (
                                <div className="w-5 h-5 border-2 border-primary/50 rounded-full relative">
                                  <div className="absolute inset-0.5 bg-primary/20 rounded-full animate-pulse"></div>
                                </div>
                              )}
                              <span className={`flex-1 ${task.completed ? 'text-card-foreground' : 'text-muted-foreground'}`}>
                                {task.text}
                              </span>
                              <div className="text-xs text-primary font-medium">{task.progress}%</div>
                            </div>
                            <div className="mt-2 ml-8 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-500"
                                style={{ width: `${task.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-4 backdrop-blur-sm">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-primary/20 rounded-xl">
                            <Calendar className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <div className="font-semibold text-card-foreground">Next Session</div>
                            <div className="text-sm text-muted-foreground">Tomorrow, 3:00 PM</div>
                          </div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-ping"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Floating Elements */}
                  <div className="absolute -top-6 -left-6 w-24 h-24 bg-gradient-to-br from-primary/20 to-accent/20 rounded-3xl animate-float" style={{ animationDelay: '0s' }}></div>
                  <div className="absolute -bottom-8 -right-8 w-20 h-20 bg-gradient-to-br from-accent/20 to-primary/20 rounded-full animate-float" style={{ animationDelay: '1s' }}></div>
                  <div className="absolute top-1/2 -right-4 w-16 h-16 bg-gradient-to-br from-primary/10 to-transparent rounded-2xl animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Enhanced */}
        <section className="py-32 bg-gradient-to-br from-card to-card/50 relative">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.01]"></div>
          <div className="container mx-auto max-w-7xl px-4 relative">
            <div className="text-center mb-20 animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 border border-primary/20">
                <Rocket className="w-4 h-4 mr-2" />
                Powerful Features
              </div>
              <h2 className="text-4xl lg:text-6xl font-bold mb-6 text-card-foreground">
                Everything You Need for
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent"> Modern Learning</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Transform your educational journey with cutting-edge tools designed for collaborative success
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Users className="h-8 w-8" />,
                  title: "Smart Study Groups",
                  description: "AI-powered matching connects you with ideal study partners based on learning styles and goals.",
                  gradient: "from-blue-500/10 to-cyan-500/10",
                  iconColor: "text-blue-600",
                  borderColor: "hover:border-blue-500/30"
                },
                {
                  icon: <BrainCircuit className="h-8 w-8" />,
                  title: "AI Study Assistant",
                  description: "Get personalized study recommendations and instant answers to complex questions.",
                  gradient: "from-purple-500/10 to-pink-500/10",
                  iconColor: "text-purple-600",
                  borderColor: "hover:border-purple-500/30"
                },
                {
                  icon: <MessageSquare className="h-8 w-8" />,
                  title: "Real-time Collaboration",
                  description: "Instant messaging, voice calls, and video sessions with crystal-clear quality.",
                  gradient: "from-green-500/10 to-emerald-500/10",
                  iconColor: "text-green-600",
                  borderColor: "hover:border-green-500/30"
                },
                {
                  icon: <PenTool className="h-8 w-8" />,
                  title: "Interactive Whiteboard",
                  description: "Unlimited canvas with advanced drawing tools, shapes, and mathematical equation support.",
                  gradient: "from-orange-500/10 to-red-500/10",
                  iconColor: "text-orange-600",
                  borderColor: "hover:border-orange-500/30"
                },
                {
                  icon: <Calendar className="h-8 w-8" />,
                  title: "Smart Scheduling",
                  description: "Automatic scheduling that finds optimal times for all group members across time zones.",
                  gradient: "from-indigo-500/10 to-blue-500/10",
                  iconColor: "text-indigo-600",
                  borderColor: "hover:border-indigo-500/30"
                },
                {
                  icon: <Shield className="h-8 w-8" />,
                  title: "Secure & Private",
                  description: "End-to-end encryption ensures your notes and discussions remain completely private.",
                  gradient: "from-gray-500/10 to-slate-500/10",
                  iconColor: "text-gray-600",
                  borderColor: "hover:border-gray-500/30"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`group p-8 bg-card/80 backdrop-blur-sm rounded-3xl border border-border/50 ${feature.borderColor} hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in-up relative overflow-hidden`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl`}></div>

                  <div className="relative">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg`}>
                      <div className={feature.iconColor}>{feature.icon}</div>
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-card-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.description}</p>

                    <div className="mt-4 h-1 w-0 bg-gradient-to-r from-primary to-accent rounded-full group-hover:w-full transition-all duration-500"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Testimonials Section */}
        <section className="py-32 bg-gradient-to-br from-muted/20 to-primary/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
          <div className="container mx-auto max-w-6xl px-4 text-center relative">
            <div className="mb-20 animate-fade-in-up">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6 border border-accent/20">
                <Award className="w-4 h-4 mr-2" />
                Student Success Stories
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">What Students Say</h2>
              <p className="text-xl text-muted-foreground">Real experiences from our community of learners</p>
            </div>

            <div className="relative">
              <div className="bg-card/90 backdrop-blur-xl rounded-3xl shadow-2xl p-12 border border-border/50 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative">
                  <div className="flex justify-center mb-8">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-7 h-7 text-yellow-500 fill-current mr-1 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                    ))}
                  </div>

                  <blockquote className="text-2xl lg:text-3xl font-medium text-card-foreground mb-8 leading-relaxed animate-fade-in">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>

                  <div className="flex items-center justify-center space-x-4 animate-fade-in">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <div className="font-bold text-lg text-card-foreground">{testimonials[currentTestimonial].name}</div>
                      <div className="text-muted-foreground">{testimonials[currentTestimonial].role}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Navigation */}
              <div className="flex justify-center mt-12 space-x-3">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`relative overflow-hidden rounded-full transition-all duration-300 ${currentTestimonial === index
                      ? 'w-12 h-4 bg-primary'
                      : 'w-4 h-4 bg-muted-foreground/30 hover:bg-muted-foreground/50'
                      }`}
                    onClick={() => setCurrentTestimonial(index)}
                  >
                    {currentTestimonial === index && (
                      <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent animate-shimmer"></div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-32 bg-gradient-to-br from-primary via-primary to-accent relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>

          <div className="relative container mx-auto max-w-4xl px-4 text-center text-primary-foreground">
            <div className="animate-fade-in-up">
              <h2 className="text-4xl lg:text-6xl font-bold mb-8 leading-tight">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl lg:text-2xl mb-16 opacity-90 max-w-2xl mx-auto leading-relaxed">
                Join thousands of students who've already discovered the power of collaborative learning
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <Button
                  size="lg"
                  variant="secondary"
                  className="group px-12 py-6 text-xl font-semibold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02] bg-white text-primary hover:bg-gray-50"
                  onClick={login}
                >
                  Get Started Free
                  <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-12 py-6 text-xl font-semibold rounded-2xl transition-all duration-300 border-2 border-primary-foreground/50 text-primary-foreground hover:bg-primary-foreground/10 hover:border-primary-foreground hover:scale-[1.02] backdrop-blur-sm"
                >
                  Book a Demo
                </Button>
              </div>

              <div className="mt-12 text-primary-foreground/80">
                <p className="text-sm">✨ No credit card required • 14-day free trial • Cancel anytime</p>
              </div>
            </div>
          </div>

          {/* Animated background elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }}></div>
        </section>

        <DeveloperSection />
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        @keyframes gradient-x {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 3s ease infinite;
        }
        
        .animate-shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          animation: shimmer 2s infinite;
        }
      `}</style>
    </>
  );
}

export default Home;
