import { useWeeklyInsight } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import TrendChart from "@/components/TrendChart";
import { motion } from "framer-motion";
import { TrendingUp, Calendar, Activity, Sparkles } from "lucide-react";

export default function Insights() {
  const { data: insights, isLoading } = useWeeklyInsight();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-2xl border-2"
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Your Insights</h1>
            <p className="text-muted-foreground">Track your mental wellness journey</p>
          </div>
        </div>
      </motion.div>

      <Tabs defaultValue="weekly" className="w-full">
        <TabsList className="glass-card border">
          <TabsTrigger value="weekly">Weekly Summary</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly" className="space-y-6 mt-6">
          {isLoading ? (
            <Card className="glass-card border-2">
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-4/6" />
              </CardContent>
            </Card>
          ) : (
            <>
              {/* AI Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="glass-card border-2 hover-lift">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-gradient-secondary flex items-center justify-center">
                        <Sparkles className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle>AI Weekly Summary</CardTitle>
                        <CardDescription>
                          {new Date(insights?.period_start || "").toLocaleDateString()} -{" "}
                          {new Date(insights?.period_end || "").toLocaleDateString()}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-base leading-relaxed">
                      {insights?.ai_summary || "Start logging your moods to receive AI insights"}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Stats Grid */}
              <div className="grid md:grid-cols-3 gap-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="glass-card border-2 hover-lift">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                          <Activity className="h-5 w-5 text-primary" />
                        </div>
                        <CardTitle className="text-lg">Average Stress</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-primary">
                        {insights?.average_stress?.toFixed(1) || "N/A"}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">out of 10</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="glass-card border-2 hover-lift">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-secondary" />
                        </div>
                        <CardTitle className="text-lg">Total Entries</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-4xl font-bold text-secondary">
                        {insights?.entries || 0}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">this week</p>
                    </CardContent>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Card className="glass-card border-2 hover-lift">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-accent/20 flex items-center justify-center">
                          <Sparkles className="h-5 w-5 text-accent" />
                        </div>
                        <CardTitle className="text-lg">Dominant Mood</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold text-accent capitalize">
                        {insights?.dominant_mood || "N/A"}
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">most common</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6 mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="glass-card border-2">
              <CardHeader>
                <CardTitle>30-Day Stress Trend</CardTitle>
                <CardDescription>Your stress levels over the past month</CardDescription>
              </CardHeader>
              <CardContent>
                <TrendChart days={30} />
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
