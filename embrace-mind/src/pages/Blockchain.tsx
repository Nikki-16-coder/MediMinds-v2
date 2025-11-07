import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Shield, CheckCircle2 } from "lucide-react";

// Mock data - replace with actual blockchain API when available
const mockVerifications = [
  {
    id: "1",
    hash: "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af...",
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "verified",
    type: "Mood Entry",
  },
  {
    id: "2",
    hash: "0x9c8d7fade1c0d57a7af66ab4ead79fade1c0d57...",
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "verified",
    type: "Chat Session",
  },
  {
    id: "3",
    hash: "0x3b2f5fade1c0d57a7af66ab4ead79fade1c0d57...",
    timestamp: new Date(Date.now() - 86400000 * 7).toISOString(),
    status: "verified",
    type: "Insight Generated",
  },
];

export default function Blockchain() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6 rounded-2xl border-2"
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Blockchain Verification</h1>
            <p className="text-muted-foreground">
              Your data is cryptographically secured and verified
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="glass-card border-2">
          <CardHeader>
            <CardTitle>Verification History</CardTitle>
            <CardDescription>
              All your data entries are verified on the blockchain
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockVerifications.map((verification, idx) => (
                <motion.div
                  key={verification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-card p-4 rounded-xl hover-lift"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                        <span className="font-semibold">{verification.type}</span>
                        <Badge variant="secondary" className="ml-auto">
                          {verification.status}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Hash:</span>
                          <code className="text-xs bg-muted px-2 py-1 rounded truncate">
                            {verification.hash}
                          </code>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Verified:</span>
                          <span>
                            {new Date(verification.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="glass-card border-2">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              <strong className="text-foreground">Privacy First:</strong> Your data is
              encrypted before being hashed and stored on the blockchain.
            </p>
            <p>
              <strong className="text-foreground">Immutable:</strong> Once verified, your
              data cannot be altered or tampered with.
            </p>
            <p>
              <strong className="text-foreground">Transparent:</strong> You can verify the
              authenticity of your data at any time.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
