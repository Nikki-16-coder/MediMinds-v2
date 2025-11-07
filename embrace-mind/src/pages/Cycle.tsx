import { useState } from "react";
import { useCycleHistory, usePostCycle, usePredictCycle } from "@/lib/hooks";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Droplets, Calendar, Plus } from "lucide-react";
import { toast } from "sonner";

export default function Cycle() {
  const { data: history, isLoading } = useCycleHistory();
  const { data: prediction } = usePredictCycle();
  const postCycle = usePostCycle();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    cycle_start: "",
    cycle_end: "",
    symptoms: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await postCycle.mutateAsync({
        cycle_start: formData.cycle_start,
        cycle_end: formData.cycle_end || undefined,
        symptoms: formData.symptoms ? formData.symptoms.split(",").map((s) => s.trim()) : undefined,
        notes: formData.notes || undefined,
      });
      toast.success("Cycle logged successfully");
      setFormData({ cycle_start: "", cycle_end: "", symptoms: "", notes: "" });
      setDialogOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to log cycle");
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-2xl border-2"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-secondary flex items-center justify-center">
              <Droplets className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Cycle Tracker</h1>
              <p className="text-muted-foreground">Track your menstrual cycle & symptoms</p>
            </div>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Log Cycle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Log Cycle Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="start">Cycle Start Date</Label>
                  <Input
                    id="start"
                    type="date"
                    value={formData.cycle_start}
                    onChange={(e) => setFormData({ ...formData, cycle_start: e.target.value })}
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="end">Cycle End Date (optional)</Label>
                  <Input
                    id="end"
                    type="date"
                    value={formData.cycle_end}
                    onChange={(e) => setFormData({ ...formData, cycle_end: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="symptoms">Symptoms (comma-separated)</Label>
                  <Input
                    id="symptoms"
                    placeholder="cramps, fatigue, headache"
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Notes (optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="mt-2"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={postCycle.isPending}>
                  {postCycle.isPending ? "Saving..." : "Save Entry"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Prediction Card */}
      {prediction && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="glass-card border-2 hover-lift">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Next Cycle Prediction</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {prediction.predicted_next_cycle_start ? (
                <div className="text-2xl font-bold text-primary">
                  {new Date(prediction.predicted_next_cycle_start).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">{prediction.message}</p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card border-2">
          <CardHeader>
            <CardTitle>Cycle History</CardTitle>
            <CardDescription>Your recorded cycles</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : history && history.length > 0 ? (
              <div className="space-y-4">
                {history.map((entry, idx) => (
                  <motion.div
                    key={entry._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="glass-card p-4 rounded-xl"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="font-semibold">
                          {new Date(entry.cycle_start).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {entry.cycle_end && (
                            <span className="text-muted-foreground">
                              {" "}
                              -{" "}
                              {new Date(entry.cycle_end).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {entry.cycle_end &&
                            `${Math.round(
                              (new Date(entry.cycle_end).getTime() -
                                new Date(entry.cycle_start).getTime()) /
                                (1000 * 60 * 60 * 24)
                            )} days`}
                        </div>
                      </div>
                    </div>

                    {entry.symptoms && entry.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {entry.symptoms.map((symptom, i) => (
                          <Badge key={i} variant="secondary">
                            {symptom}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {entry.notes && (
                      <p className="text-sm text-muted-foreground">{entry.notes}</p>
                    )}
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">
                No cycle entries yet. Start tracking!
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
