import { useState } from "react";
import { usePostMood } from "@/lib/hooks";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Slider } from "./ui/slider";
import { Label } from "./ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const moodEmojis = [
  { emoji: "😊", label: "Happy", mood: "happy" },
  { emoji: "😌", label: "Calm", mood: "calm" },
  { emoji: "😔", label: "Sad", mood: "sad" },
  { emoji: "😰", label: "Anxious", mood: "anxious" },
  { emoji: "😡", label: "Angry", mood: "angry" },
  { emoji: "😴", label: "Tired", mood: "tired" },
];

export default function MoodForm({ onSuccess }: { onSuccess?: () => void }) {
  const [selectedMood, setSelectedMood] = useState<string>("");
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [note, setNote] = useState("");
  const postMood = usePostMood();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood) {
      toast.error("Please select a mood");
      return;
    }

    try {
      await postMood.mutateAsync({
        mood: selectedMood,
        stress_level: stressLevel,
        note: note || undefined,
      });
      toast.success("Mood logged successfully");
      setSelectedMood("");
      setStressLevel(5);
      setNote("");
      onSuccess?.();
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to log mood");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label className="text-base mb-4 block">How are you feeling?</Label>
        <div className="grid grid-cols-3 gap-3">
          {moodEmojis.map((item) => (
            <button
              key={item.mood}
              type="button"
              onClick={() => setSelectedMood(item.mood)}
              className={`p-4 rounded-2xl border-2 transition-all hover-lift ${
                selectedMood === item.mood
                  ? "border-primary bg-primary/10"
                  : "border-border bg-card"
              }`}
            >
              <div className="text-4xl mb-2">{item.emoji}</div>
              <div className="text-sm font-medium">{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <Label className="text-base mb-4 block">
          Stress Level: {stressLevel}/10
        </Label>
        <Slider
          value={[stressLevel]}
          onValueChange={(v) => setStressLevel(v[0])}
          min={1}
          max={10}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted-foreground mt-2">
          <span>Relaxed</span>
          <span>Very Stressed</span>
        </div>
      </div>

      <div>
        <Label htmlFor="note" className="text-base mb-2 block">
          Note (optional)
        </Label>
        <Textarea
          id="note"
          placeholder="How was your day? Any thoughts to share..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="min-h-[100px] resize-none"
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={postMood.isPending}
      >
        {postMood.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          "Save Mood"
        )}
      </Button>
    </form>
  );
}
