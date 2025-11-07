import { useState } from "react";
import { useAuth } from "@/store/useAuth";
import { useWeeklyInsight, useChatHistory } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import MoodForm from "@/components/MoodForm";
import { motion } from "framer-motion";
import { Smile, TrendingUp, MessageCircle, Sparkles } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: insights, isLoading: insightsLoading } = useWeeklyInsight();
  const { data: chatHistory } = useChatHistory(3);
  const [moodDialogOpen, setMoodDialogOpen] = useState(false);

  const quotes = [
    "Every day is a fresh start",
    "You are stronger than you think",
    "Progress, not perfection",
    "Your feelings are valid",
  ];

  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 rounded-2xl border-2"
      >
        <h1 className="text-4xl font-bold mb-2">
          Hi {user?.name || "there"} 👋
        </h1>
        <p className="text-lg text-muted-foreground">{randomQuote}</p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Today's Mood Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-2 hover-lift h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                  <Smile className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>Today's Mood</CardTitle>
                  <CardDescription>How are you feeling right now?</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Dialog open={moodDialogOpen} onOpenChange={setMoodDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full" size="lg">
                    Log Your Mood
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>How are you feeling?</DialogTitle>
                  </DialogHeader>
                  <MoodForm onSuccess={() => setMoodDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Weekly Insight */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-card border-2 hover-lift h-full">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-secondary flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle>AI Weekly Insight</CardTitle>
                  <CardDescription>Your personalized summary</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {insightsLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ) : insights?.ai_summary ? (
                <div>
                  <p className="text-sm leading-relaxed mb-4">
                    {insights.ai_summary}
                  </p>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="glass-card p-3 rounded-xl">
                      <div className="text-2xl font-bold text-primary">
                        {insights.average_stress?.toFixed(1) || "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">Avg Stress</div>
                    </div>
                    <div className="glass-card p-3 rounded-xl">
                      <div className="text-2xl font-bold text-secondary">
                        {insights.entries}
                      </div>
                      <div className="text-xs text-muted-foreground">Entries</div>
                    </div>
                    <div className="glass-card p-3 rounded-xl">
                      <div className="text-lg font-bold text-accent capitalize">
                        {insights.dominant_mood || "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">Top Mood</div>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Start logging your moods to receive AI insights
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recent Chat */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="glass-card border-2 hover-lift">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                  <MessageCircle className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle>Recent Chat</CardTitle>
                  <CardDescription>Your latest conversations</CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={() => window.location.href = "/app/chat"}>
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {chatHistory && chatHistory.length > 0 ? (
              <div className="space-y-3">
                {chatHistory.slice(0, 3).map((msg) => (
                  <div
                    key={msg._id}
                    className="glass-card p-4 rounded-xl"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.role === "assistant" ? "bg-gradient-primary" : "bg-secondary"
                      }`}>
                        <span className="text-white text-sm font-medium">
                          {msg.role === "assistant" ? "AI" : "You"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-relaxed line-clamp-2">
                          {msg.message}
                        </p>
                        <span className="text-xs text-muted-foreground mt-1 block">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No chat history yet. Start a conversation!
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
