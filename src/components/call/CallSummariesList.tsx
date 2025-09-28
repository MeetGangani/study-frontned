import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Clock, 
  Users, 
  Calendar, 
  MessageSquare, 
  FileText,
  RefreshCw,
  Eye,
  Download,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { format } from 'date-fns';
import { getCallSummaries, CallSummary } from '@/utils/audioTranscription';
import { useAuth } from '@/components/providers/auth';
import { toast } from 'sonner';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@radix-ui/react-collapsible';

interface CallSummariesListProps {
  groupId: string;
}

interface SummaryCardProps {
  summary: CallSummary;
  onViewDetails: (summary: CallSummary) => void;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ summary, onViewDetails }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const duration = Math.floor(summary.duration / 60);
  const seconds = summary.duration % 60;

  const formatDuration = (duration: number) => {
    const minutes = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const exportSummary = () => {
    const content = `
Call Summary - ${summary.session?.name || 'Group Discussion'}
Date: ${format(new Date(summary.startTime), 'PPp')}
Duration: ${formatDuration(summary.duration)}
Participants: ${summary.participants.length}

TRANSCRIPT:
${summary.transcript}

SUMMARY:
${summary.summary}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-summary-${format(new Date(summary.startTime), 'yyyy-MM-dd-HH-mm')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Summary exported successfully');
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">
              {summary.session?.name || 'Group Discussion'}
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>{format(new Date(summary.startTime), 'MMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{format(new Date(summary.startTime), 'HH:mm')}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{formatDuration(summary.duration)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={14} />
                <span>{summary.participants.length} participants</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary">
              {format(new Date(summary.createdAt), 'MMM d')}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={exportSummary}
            >
              <Download size={14} className="mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between p-0 h-auto">
              <span className="text-left">
                {summary.summary.slice(0, 150)}
                {summary.summary.length > 150 ? '...' : ''}
              </span>
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-4 mt-4">
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <FileText size={14} />
                Summary
              </h4>
              <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded-md">
                {summary.summary}
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <MessageSquare size={14} />
                Transcript
              </h4>
              <ScrollArea className="h-32">
                <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-3 rounded-md">
                  {summary.transcript}
                </div>
              </ScrollArea>
            </div>
          </CollapsibleContent>
        </Collapsible>
        
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onViewDetails(summary)}
          >
            <Eye size={14} className="mr-1" />
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const CallSummariesList: React.FC<CallSummariesListProps> = ({ groupId }) => {
  const [summaries, setSummaries] = useState<CallSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSummary, setSelectedSummary] = useState<CallSummary | null>(null);
  const { user } = useAuth();

  const loadSummaries = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const data = await getCallSummaries(groupId, token || undefined);
      setSummaries(data);
    } catch (error) {
      console.error('Error loading call summaries:', error);
      toast.error('Failed to load call summaries');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSummaries();
  }, [groupId, user]);

  const handleViewDetails = (summary: CallSummary) => {
    setSelectedSummary(summary);
  };

  const handleRefresh = () => {
    loadSummaries();
    toast.success('Call summaries refreshed');
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Call Summaries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="animate-spin mr-2" size={20} />
            <span>Loading summaries...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (selectedSummary) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Call Summary Details</CardTitle>
            <Button
              variant="outline"
              onClick={() => setSelectedSummary(null)}
            >
              Back to List
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <SummaryCard 
            summary={selectedSummary} 
            onViewDetails={() => {}} 
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Call Summaries ({summaries.length})</CardTitle>
          <Button variant="outline" onClick={handleRefresh} size="sm">
            <RefreshCw size={14} className="mr-1" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {summaries.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
            <p>No call summaries yet</p>
            <p className="text-sm">Start a group discussion to generate summaries</p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-4">
              {summaries.map((summary) => (
                <SummaryCard
                  key={summary.id}
                  summary={summary}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default CallSummariesList;