import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useSignup } from "@/lib/hooks";
import { useAuth } from "@/store/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Brain, Tag, X } from "lucide-react";
import { motion } from "framer-motion";
import type { Gender } from "@/lib/types";

const goalOptions = [
  "Reduce Stress",
  "Better Sleep",
  "Manage Anxiety",
  "Mood Tracking",
  "Self-Care",
  "Emotional Balance",
];

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    gender: "" as Gender,
    age: "",
    goals: [] as string[],
  });
  const navigate = useNavigate();
  const signup = useSignup();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/app/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.gender || !formData.age) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await signup.mutateAsync({
        ...formData,
        age: parseInt(formData.age),
      });
      toast.success("Account created successfully!");
      navigate("/app/dashboard");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create account");
    }
  };

  const toggleGoal = (goal: string) => {
    setFormData((prev) => ({
      ...prev,
      goals: prev.goals.includes(goal)
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal],
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-lg"
      >
        <Card className="glass-card p-8 border-2">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-primary mb-4">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold gradient-text mb-2">Join MediMinds</h1>
            <p className="text-muted-foreground">
              Start your mental wellness journey today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Alex Smith"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="mt-2"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={formData.gender}
                  onValueChange={(value) => setFormData({ ...formData, gender: value as Gender })}
                  required
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="mt-2"
                  min="13"
                  max="120"
                  required
                />
              </div>
            </div>

            <div>
              <Label className="mb-3 block">Your Goals (optional)</Label>
              <div className="flex flex-wrap gap-2">
                {goalOptions.map((goal) => (
                  <button
                    key={goal}
                    type="button"
                    onClick={() => toggleGoal(goal)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all hover-lift flex items-center gap-1.5 ${
                      formData.goals.includes(goal)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Tag className="h-3 w-3" />
                    {goal}
                    {formData.goals.includes(goal) && <X className="h-3 w-3" />}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={signup.isPending}
            >
              {signup.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:underline font-medium">
              Sign In
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
