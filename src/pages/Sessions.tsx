import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Calendar, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface SessionSummary {
  id: string;
  session_date: string;
  summary: string;
  key_takeaways: string[] | null;
  provider_name: string | null;
  created_at: string;
}

export default function Sessions() {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<SessionSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0]);
  const [providerName, setProviderName] = useState("");
  const [summary, setSummary] = useState("");
  const [takeaways, setTakeaways] = useState("");

  const fetchSessions = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("session_summaries")
      .select("*")
      .eq("user_id", user.id)
      .order("session_date", { ascending: false });

    if (error) {
      console.error("Error fetching sessions:", error);
    } else {
      setSessions(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const handleSaveSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!summary.trim()) {
      toast({
        title: "Summary required",
        description: "Please add a summary of your session.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const keyTakeaways = takeaways
      .split('\n')
      .map(t => t.trim())
      .filter(t => t.length > 0);

    const { error } = await supabase
      .from("session_summaries")
      .insert({
        user_id: user.id,
        session_date: sessionDate,
        summary: summary.trim(),
        key_takeaways: keyTakeaways.length > 0 ? keyTakeaways : null,
        provider_name: providerName.trim() || null,
      });

    setSaving(false);

    if (error) {
      console.error("Error saving session:", error);
      toast({
        title: "Error saving session",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Session saved! 📝",
        description: "Your therapy session has been recorded.",
      });
      
      // Reset form
      setSessionDate(new Date().toISOString().split('T')[0]);
      setProviderName("");
      setSummary("");
      setTakeaways("");
      setShowForm(false);
      fetchSessions();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Calendar className="h-8 w-8 text-primary" />
                Therapy Sessions
              </h1>
              <p className="text-muted-foreground">
                Track and reflect on your therapy sessions.
              </p>
            </div>
            <Button 
              onClick={() => setShowForm(!showForm)}
              variant={showForm ? "outline" : "hero"}
            >
              {showForm ? "Cancel" : (
                <>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Session
                </>
              )}
            </Button>
          </div>
        </div>

        {showForm && (
          <Card className="shadow-lg border-border/50 mb-8">
            <CardHeader>
              <CardTitle>New Session Summary</CardTitle>
              <CardDescription>
                Record key details from your therapy session.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveSession} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="session-date">Session Date</Label>
                    <Input
                      id="session-date"
                      type="date"
                      value={sessionDate}
                      onChange={(e) => setSessionDate(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provider-name">Provider/Therapist Name (Optional)</Label>
                    <Input
                      id="provider-name"
                      placeholder="Dr. Smith"
                      value={providerName}
                      onChange={(e) => setProviderName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="summary">Session Summary</Label>
                  <Textarea
                    id="summary"
                    placeholder="What did you discuss? How did you feel? What insights did you gain?"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="takeaways">Key Takeaways (One per line)</Label>
                  <Textarea
                    id="takeaways"
                    placeholder="Practice deep breathing when anxious&#10;Journal before bed&#10;Set boundaries with work emails"
                    value={takeaways}
                    onChange={(e) => setTakeaways(e.target.value)}
                    rows={3}
                  />
                </div>

                <Button type="submit" disabled={saving} variant="hero">
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Session"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Session List */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : sessions.length === 0 ? (
            <Card className="shadow-lg border-border/50">
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <p className="text-muted-foreground">No therapy sessions recorded yet.</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click "Add Session" to record your first session.
                </p>
              </CardContent>
            </Card>
          ) : (
            sessions.map((session) => (
              <Card key={session.id} className="shadow-lg border-border/50">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {new Date(session.session_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </CardTitle>
                    {session.provider_name && (
                      <Badge variant="secondary">{session.provider_name}</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-foreground">{session.summary}</p>
                  {session.key_takeaways && session.key_takeaways.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-muted-foreground">Key Takeaways:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {session.key_takeaways.map((takeaway, index) => (
                          <li key={index} className="text-sm text-foreground">{takeaway}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
