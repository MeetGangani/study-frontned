import { Edit2, Play, Trash2, CheckCircle, Zap } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { useAuth } from "../providers/auth";
import { useSession } from "@/contexts/SessionContext";
import { SessionType } from "./Session";
import { format } from "date-fns";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";

const SessionCard = ({
  session,
  onEdit,
  onDelete,
  children
}: {
  session: SessionType;
  onEdit: () => void;
  onDelete: () => void;
  children?: React.ReactNode;
}) => {
  const { user } = useAuth();
  const { startSession, joinSession } = useSession();
  const [summary, setSummary] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [isSummaryOpen, setIsSummaryOpen] = useState(false);
  const [transcript, setTranscript] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;
    async function fetchSummary() {
      setLoadingSummary(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sessions/${session.id}/summary`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        if (!ignore) {
          setSummary(data.summary || null);
          setStatus(data.status || null);
          setTranscript(data.transcript || null);
        }
      } catch (_) {
        if (!ignore) setStatus("failed");
      } finally {
        if (!ignore) setLoadingSummary(false);
      }
    }
    fetchSummary();
    return () => { ignore = true; };
  }, [session.id, session.endedAt]);
  
  const refreshSummary = async () => {
    setLoadingSummary(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sessions/${session.id}/summary`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setSummary(data.summary || null);
      setStatus(data.status || null);
      setTranscript(data.transcript || null);
    } catch (_) {
      setStatus("failed");
    } finally {
      setLoadingSummary(false);
    }
  };

  // Auto-refresh on dialog open if summary is not yet completed
  useEffect(() => {
    if (isSummaryOpen && status !== "completed" && !loadingSummary) {
      void refreshSummary();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSummaryOpen]);
  
  const handleDelete = async () => {
    try {
      await onDelete();
      toast.success("Session deleted successfully");
    } catch (error) {
      toast.error("Failed to delete session");
    }
  };

  return (
    <Card className="border-l-4 border-l-primary">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-lg">{session.name}</CardTitle>
            <CardDescription>
              {format(new Date(session.time), "PPP 'at' p")}
            </CardDescription>
            {session.endedAt && (
              <CardDescription className="text-destructive">
                Ended at {format(new Date(session.endedAt), "p")}
              </CardDescription>
            )}
            <p className="mt-2 text-sm text-muted-foreground">
              {session.description}
            </p>
            {session.prerequisites && (
              <p className="mt-1 text-sm">
                <strong>Prerequisites:</strong> {session.prerequisites}
              </p>
            )}
            {session.isStarted && !session.endedAt && (
              <Badge variant="secondary" className="mt-2">
                <Zap className="h-4 w-4 mr-1" />
                In Progress
              </Badge>
            )}
            {session.endedAt && (
              <Badge variant="secondary" className="mt-2 bg-muted">
                <CheckCircle className="h-4 w-4 mr-1" />
                Completed
              </Badge>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            {session.creatorID === user?.id && !session.endedAt && (
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" onClick={onEdit}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            )}
            {/* Only show delete for ended sessions */}
            {session.creatorID === user?.id && session.endedAt && (
              <Button variant="ghost" size="icon" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            )}
            {!session.endedAt && (
              <>
                {session.isStarted 
                  ? session.creatorID !== user?.id && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => joinSession(session.id)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Join Session
                      </Button>
                    )
                  : session.creatorID === user?.id && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => startSession(session.id)}
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                    )}
              </>
            )}
          </div>
        </div>
        {(session.endedAt || status || transcript) && (
          <div className="mt-4">
            <Dialog open={isSummaryOpen} onOpenChange={setIsSummaryOpen}>
              <DialogTrigger asChild>
                <Button variant="secondary" size="sm">
                  View AI summary (beta)
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Session Review</DialogTitle>
                  <DialogDescription>
                    AI summary may contain inaccuracies. Compare with the transcript before relying on details.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">
                      {loadingSummary ? "Fetching latest…" : status === "completed" ? "Ready" : status === "pending" ? "Generating…" : status === "failed" ? "Unavailable" : "Not available"}
                    </div>
                    <Button variant="ghost" size="sm" onClick={refreshSummary} disabled={loadingSummary}>
                      Refresh
                    </Button>
                  </div>
                  <Tabs defaultValue={transcript ? "transcript" : "summary"}>
                    <TabsList>
                      <TabsTrigger value="transcript">Transcript</TabsTrigger>
                      <TabsTrigger value="summary">AI Summary (beta)</TabsTrigger>
                    </TabsList>
                    <TabsContent value="transcript">
                      <div className="rounded-md border p-3 max-h-80 overflow-auto">
                        {transcript ? (
                          <p className="text-sm whitespace-pre-wrap">{transcript}</p>
                        ) : (
                          <p className="text-sm text-muted-foreground">Transcript not available.</p>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="summary">
                      <div className="rounded-md border p-3 max-h-80 overflow-auto">
                        {loadingSummary && (
                          <p className="text-sm text-muted-foreground">Loading summary…</p>
                        )}
                        {!loadingSummary && status === "completed" && summary && (
                          <p className="text-sm whitespace-pre-wrap">{summary}</p>
                        )}
                        {!loadingSummary && (!summary || status !== "completed") && (
                          <p className="text-sm text-muted-foreground">No summary available yet.</p>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
        {children}
      </CardHeader>
    </Card>
  );
};

export default SessionCard;
