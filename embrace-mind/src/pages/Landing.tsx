import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
  Brain,
  MessageCircle,
  TrendingUp,
  Shield,
  Sparkles,
  Heart,
  Lock,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "AI Companion",
    description: "Chat with an empathetic AI that understands and supports your mental wellness journey.",
    gradient: "from-primary to-primary/60",
  },
  {
    icon: TrendingUp,
    title: "Insights & Analytics",
    description: "Track your emotional patterns with beautiful visualizations and AI-powered weekly summaries.",
    gradient: "from-secondary to-secondary/60",
  },
  {
    icon: Heart,
    title: "Mood Tracking",
    description: "Log your daily moods, stress levels, and notes to build awareness of your emotional health.",
    gradient: "from-accent to-accent/60",
  },
  {
    icon: Shield,
    title: "Blockchain Verified",
    description: "Your data is cryptographically secured and verified on the blockchain for ultimate privacy.",
    gradient: "from-primary to-accent",
  },
];

const benefits = [
  "Private & secure - your data stays encrypted",
  "AI-powered insights tailored to you",
  "Track moods, cycles, and emotional patterns",
  "Chat anytime with your AI wellness companion",
  "Beautiful, intuitive interface you'll love using",
];

export default function Landing() {
  const navigate = useNavigate();
  const { user, initialize } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center">
              <Brain className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold gradient-text">MediMinds</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <Button variant="ghost" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button onClick={() => navigate("/signup")}>Get Started</Button>
          </motion.div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-6 border">
              <Lock className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Private & Secure Mental Wellness</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your Journey to
              <br />
              <span className="gradient-text">Mental Wellness</span>
            </h1>

            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              A private, AI-powered companion that helps you understand your emotions,
              track your mental health, and build lasting wellness habits.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 gap-2"
                onClick={() => navigate("/signup")}
              >
                Start Your Journey
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </div>
          </motion.div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="glass-card p-8 rounded-3xl border-2 shadow-soft">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="glass-card p-6 border hover-lift">
                  <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">AI Weekly Insight</h3>
                  <p className="text-sm text-muted-foreground">
                    Get personalized summaries of your emotional patterns and wellness progress
                  </p>
                </Card>

                <Card className="glass-card p-6 border hover-lift">
                  <div className="h-12 w-12 rounded-xl bg-gradient-secondary flex items-center justify-center mb-4">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">24/7 AI Companion</h3>
                  <p className="text-sm text-muted-foreground">
                    Always available to listen, support, and guide you through any moment
                  </p>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need for
              <br />
              <span className="gradient-text">Mental Wellness</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools designed to support your emotional health and personal growth
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, idx) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="glass-card p-8 border-2 hover-lift h-full">
                  <div
                    className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6`}
                  >
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-3xl border-2"
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-4">Why Choose MediMinds?</h2>
              <p className="text-lg text-muted-foreground">
                Join thousands taking control of their mental wellness
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, idx) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-lg">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass-card p-12 rounded-3xl border-2 text-center"
          >
            <div className="h-16 w-16 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
              <Brain className="h-8 w-8 text-white" />
            </div>

            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Journey?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join MediMinds today and take the first step towards better mental wellness.
              Your journey begins with a single click.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="text-lg px-8 py-6 gap-2"
                onClick={() => navigate("/signup")}
              >
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6"
                onClick={() => navigate("/login")}
              >
                Sign In
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Brain className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">MediMinds</span>
            </div>

            <p className="text-sm text-muted-foreground text-center">
              © 2024 MediMinds. Your mental wellness companion.
              <br />
              Private, secure, and always here for you.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
