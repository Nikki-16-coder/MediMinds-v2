import { Card } from "@/components/ui/card";
import ChatMessages from "@/components/ChatMessages";
import ChatComposer from "@/components/ChatComposer";
import { MessageCircle } from "lucide-react";

export default function Chat() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="glass-card border-2 flex flex-col" style={{ height: "calc(100vh - 180px)" }}>
        <div className="p-6 border-b">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
              <MessageCircle className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">AI Companion</h2>
              <p className="text-sm text-muted-foreground">
                Share your thoughts, feelings, and questions
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <ChatMessages />
        </div>

        <ChatComposer />
      </Card>
    </div>
  );
}
