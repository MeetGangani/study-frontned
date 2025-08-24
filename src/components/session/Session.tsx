import { useAuth } from "@/components/providers/auth";
import { useSession } from "@/contexts/SessionContext";
import { sessionFormSchema } from "@/lib/validations/session";
import { format, addDays, isSameDay, isToday, isTomorrow } from "date-fns";
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Users, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Check,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import { Badge } from "../ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { SessionList } from "./SessionList";

// Enhanced form data interface
interface SessionFormData {
  title: string;
  description: string;
  date: Date;
  time: string;
  prerequisites?: string;
}

// session interface (keeping your existing one)
export interface SessionType {
  id: string;
  name: string;
  description?: string;
  time: string;
  prerequisites?: string;
  isStarted: boolean;
  startedAt?: string;
  endedAt?: string;
  groupId: string;
  creatorID: string;
  createdAt: string;
}

// Enhanced DateTime Picker Component
const EnhancedDateTimePicker = ({ 
  date, 
  time, 
  onDateChange, 
  onTimeChange, 
  errors 
}: {
  date: Date;
  time: string;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  errors: { date?: string; time?: string };
}) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  // Generate time options (24-hour format)
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  const calendarDays = generateCalendarDays();
  const timeOptions = generateTimeOptions();

  const formatDateDisplay = (date: Date) => {
    if (isToday(date)) return "Today";
    if (isTomorrow(date)) return "Tomorrow";
    return format(date, "MMM dd, yyyy");
  };

  return (
    <div className="space-y-4">
      {/* Date Picker */}
      <div className="space-y-2">
        <Label>Session Date</Label>
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            className={`w-full justify-start text-left font-normal ${
              errors.date ? "border-red-500" : ""
            }`}
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {formatDateDisplay(date)}
          </Button>
          
          <AnimatePresence>
            {showCalendar && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 z-50 bg-background border border-border rounded-lg shadow-lg p-4 w-80"
              >
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="font-semibold">
                    {format(currentMonth, "MMMM yyyy")}
                  </h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="p-2 text-xs font-medium text-center text-muted-foreground">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                    const isSelected = isSameDay(day, date);
                    const isPast = day < new Date() && !isToday(day);
                    const isToday_ = isToday(day);

                    return (
                      <Button
                        key={index}
                        type="button"
                        variant="ghost"
                        size="sm"
                        disabled={isPast}
                        className={`p-2 h-8 w-8 text-xs ${
                          !isCurrentMonth ? "text-muted-foreground/40" : ""
                        } ${
                          isSelected ? "bg-primary text-primary-foreground" : ""
                        } ${
                          isToday_ ? "ring-2 ring-primary ring-offset-1" : ""
                        } ${
                          isPast ? "opacity-40 cursor-not-allowed" : ""
                        }`}
                        onClick={() => {
                          if (!isPast) {
                            onDateChange(day);
                            setShowCalendar(false);
                          }
                        }}
                      >
                        {day.getDate()}
                      </Button>
                    );
                  })}
                </div>

                {/* Quick Select Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onDateChange(new Date());
                      setShowCalendar(false);
                    }}
                  >
                    Today
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      onDateChange(addDays(new Date(), 1));
                      setShowCalendar(false);
                    }}
                  >
                    Tomorrow
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
      </div>

      {/* Time Picker */}
      <div className="space-y-2">
        <Label>Session Time</Label>
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            className={`w-full justify-start text-left font-normal ${
              errors.time ? "border-red-500" : ""
            }`}
            onClick={() => setShowTimePicker(!showTimePicker)}
          >
            <Clock className="mr-2 h-4 w-4" />
            {time || "Select time"}
          </Button>
          
          <AnimatePresence>
            {showTimePicker && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 mt-2 z-50 bg-background border border-border rounded-lg shadow-lg w-full max-w-xs"
              >
                <ScrollArea className="h-48 p-2">
                  <div className="space-y-1">
                    {timeOptions.map((timeOption) => (
                      <Button
                        key={timeOption}
                        type="button"
                        variant="ghost"
                        size="sm"
                        className={`w-full justify-start ${
                          time === timeOption ? "bg-primary text-primary-foreground" : ""
                        }`}
                        onClick={() => {
                          onTimeChange(timeOption);
                          setShowTimePicker(false);
                        }}
                      >
                        {timeOption}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
      </div>
    </div>
  );
};

// Enhanced Session Form
const EnhancedSessionForm = ({
  formData,
  formErrors,
  onSubmit,
  onChange,
  onDateChange,
  onTimeChange,
  submitLabel,
}: {
  formData: SessionFormData;
  formErrors: Record<string, string>;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onDateChange: (date: Date) => void;
  onTimeChange: (time: string) => void;
  submitLabel: string;
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Session Title</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="e.g., Math Problem Solving Session"
          className={formErrors.title ? "border-red-500" : ""}
        />
        {formErrors.title && (
          <p className="text-sm text-red-500">{formErrors.title}</p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={onChange}
          placeholder="Describe what you'll be studying and any specific topics..."
          rows={3}
          className={formErrors.description ? "border-red-500" : ""}
        />
        {formErrors.description && (
          <p className="text-sm text-red-500">{formErrors.description}</p>
        )}
      </div>

      {/* Enhanced DateTime Picker */}
      <EnhancedDateTimePicker
        date={formData.date}
        time={formData.time}
        onDateChange={onDateChange}
        onTimeChange={onTimeChange}
        errors={{
          date: formErrors.date,
          time: formErrors.time,
        }}
      />

      {/* Prerequisites */}
      <div className="space-y-2">
        <Label htmlFor="prerequisites">Prerequisites (Optional)</Label>
        <Textarea
          id="prerequisites"
          name="prerequisites"
          value={formData.prerequisites || ""}
          onChange={onChange}
          placeholder="Any materials or preparation needed for this session..."
          rows={2}
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          <Check className="mr-2 h-4 w-4" />
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

const Session = () => {
  const {
    sessions,
    addSession,
    fetchGroupSessions,
    deleteSession,
    editSession,
    endSession,
  } = useSession();
  const { user } = useAuth();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState<SessionFormData>({
    title: "",
    description: "",
    date: new Date(),
    time: "09:00",
  });
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<SessionType | null>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const { groupId } = useParams<{ groupId: string }>();

  useEffect(() => {
    if (groupId) {
      fetchGroupSessions(groupId);
    }
  }, [groupId]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date) => {
    setFormData((prev) => ({ ...prev, date }));
  };

  const handleTimeChange = (time: string) => {
    setFormData((prev) => ({ ...prev, time }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId) return;

    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.date) {
      errors.date = "Please select a date";
    }

    if (!formData.time) {
      errors.time = "Please select a time";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const [hours, minutes] = formData.time.split(":");
    const sessionDate = new Date(formData.date);
    sessionDate.setHours(parseInt(hours), parseInt(minutes));

    // Check if the session is in the past
    if (sessionDate < new Date()) {
      setFormErrors({ date: "Session cannot be scheduled in the past" });
      return;
    }

    try {
      sessionFormSchema.parse({
        title: formData.title,
        description: formData.description,
        date: sessionDate,
        time: formData.time,
        prerequisites: formData.prerequisites,
      });

      setFormErrors({});

      await addSession({
        name: formData.title,
        time: sessionDate.toISOString(),
        description: formData.description,
        prerequisites: formData.prerequisites,
        groupId: groupId,
      });

      toast.success("Session created successfully");
      setIsDialogOpen(false);
      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            if (err.path && err.path.length > 0) {
              errors[String(err.path[0])] = err.message;
            }
          }
        });
        setFormErrors(errors);
      }
      toast.error("Please check the form for errors");
    }
  };

  const sortedSessions = [...sessions].sort((a, b) => {
    return new Date(a.time).getTime() - new Date(b.time).getTime();
  });

  const now = new Date();
  const upcomingSessions = sortedSessions.filter(
    (session) => new Date(session.time) > now
  );
  const pastSessions = sortedSessions.filter(
    (session) => new Date(session.time) <= now
  );

  const handleEdit = (session: SessionType) => {
    const sessionDate = new Date(session.time);
    setEditingSession(session);
    setFormData({
      title: session.name,
      description: session.description || "",
      date: sessionDate,
      time: format(sessionDate, "HH:mm"),
      prerequisites: session.prerequisites || "",
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupId || !editingSession) return;

    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      errors.description = "Description is required";
    }

    if (!formData.date) {
      errors.date = "Please select a date";
    }

    if (!formData.time) {
      errors.time = "Please select a time";
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const [hours, minutes] = formData.time.split(":");
    const sessionDate = new Date(formData.date);
    sessionDate.setHours(parseInt(hours), parseInt(minutes));

    if (sessionDate < new Date()) {
      setFormErrors({ date: "Session cannot be scheduled in the past" });
      return;
    }

    try {
      const validationSchema = z.object({
        title: z
          .string()
          .min(3, "Title must be at least 3 characters")
          .max(50, "Title must be less than 50 characters"),
        description: z
          .string()
          .min(10, "Description must be at least 10 characters")
          .max(500, "Description must be less than 500 characters"),
        time: z
          .string()
          .regex(
            /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
            "Please select a valid time"
          ),
        prerequisites: z.string().optional(),
      });

      validationSchema.parse({
        title: formData.title,
        description: formData.description,
        time: formData.time,
        prerequisites: formData.prerequisites,
      });

      setFormErrors({});

      await editSession(editingSession.id, {
        name: formData.title,
        time: sessionDate.toISOString(),
        description: formData.description,
        prerequisites: formData.prerequisites,
      });

      toast.success("Session updated successfully");
      setIsEditDialogOpen(false);
      setEditingSession(null);
      setFormData({
        title: "",
        description: "",
        date: new Date(),
        time: "09:00",
        prerequisites: "",
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            errors[err.path.join(".")] = err.message;
          }
        });
        setFormErrors(errors);
      }
      toast.error("Please check the form for errors");
    }
  };

  const isSessionCreator = (session: SessionType) => {
    return user?.id === session.creatorID;
  };

  return (
    <div className="relative pb-24">
      <Card className="max-h-[calc(100vh-12rem)] overflow-hidden flex flex-col">
        <CardHeader className="shrink-0 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CalendarIcon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Study Sessions</CardTitle>
                <CardDescription>Schedule and manage your group study time</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {sessions.length} sessions
              </Badge>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    New Session
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <CalendarIcon className="h-5 w-5 text-primary" />
                      Create Study Session
                    </DialogTitle>
                    <DialogDescription>
                      Schedule a new study session for your group members
                    </DialogDescription>
                  </DialogHeader>
                  <EnhancedSessionForm
                    formData={formData}
                    formErrors={formErrors}
                    onSubmit={handleSubmit}
                    onChange={handleInputChange}
                    onDateChange={handleDateChange}
                    onTimeChange={handleTimeChange}
                    submitLabel="Create Session"
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-hidden p-6">
          <ScrollArea className="h-full pr-4">
            <div className="grid grid-cols-1 gap-6">
              {upcomingSessions.length > 0 && (
                <div className="w-full">
                  <SessionList
                    title="Upcoming Sessions"
                    sessions={upcomingSessions}
                    onEdit={handleEdit}
                    onDelete={deleteSession}
                    onEndSession={endSession}
                    isSessionCreator={isSessionCreator}
                  />
                </div>
              )}

              {pastSessions.length > 0 && (
                <div className="w-full">
                  <SessionList
                    title="Past Sessions"
                    sessions={pastSessions}
                    onEdit={handleEdit}
                    onDelete={deleteSession}
                    onEndSession={endSession}
                    isSessionCreator={isSessionCreator}
                  />
                </div>
              )}

              {sessions.length === 0 && (
                <div className="text-center py-12">
                  <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <CalendarIcon className="h-12 w-12 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No Sessions Yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first study session to get started
                  </p>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="bg-primary hover:bg-primary/90"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create First Session
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-primary" />
              Edit Study Session
            </DialogTitle>
            <DialogDescription>
              Update your study session details
            </DialogDescription>
          </DialogHeader>
          <EnhancedSessionForm
            formData={formData}
            formErrors={formErrors}
            onSubmit={handleEditSubmit}
            onChange={handleInputChange}
            onDateChange={handleDateChange}
            onTimeChange={handleTimeChange}
            submitLabel="Save Changes"
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Session;
