import { useState } from "react";
import { useSendMessage } from "@/lib/hooks";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function ChatComposer() {
  const [message, setMessage] = useState("");
  const sendMessage = useSendMessage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await sendMessage.mutateAsync(message);
      setMessage("");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send message");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-4 border-t sticky bottom-0">
      <div className="flex gap-3 items-end">
        <Textarea
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          className="min-h-[60px] max-h-[200px] resize-none"
          disabled={sendMessage.isPending}
        />
        <Button
          type="submit"
          size="icon"
          className="h-12 w-12 flex-shrink-0"
          disabled={!message.trim() || sendMessage.isPending}
        >
          {sendMessage.isPending ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
        </Button>
      </div>
      {sendMessage.isPending && (
        <div className="mt-2 text-sm text-muted-foreground flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          AI is thinking...
        </div>
      )}
    </form>
  );
}
