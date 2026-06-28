import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGateTokens } from "@/hooks/useGateTokens";
import { Loader2, ShoppingCart, Zap } from "lucide-react";
import { useState } from "react";

interface TokenConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxInventory: number;
  purchasePrice: { credits: number };
}

const TOKEN_CONFIGS: Record<string, TokenConfig> = {
  anomaly: {
    id: "anomaly",
    name: "Anomaly Gate Token",
    description: "Access dimensional anomalies",
    icon: "⚡",
    maxInventory: 50,
    purchasePrice: { credits: 2500 },
  },
  raid: {
    id: "raid",
    name: "Raid Access Token",
    description: "Participate in raid operations",
    icon: "⚔️",
    maxInventory: 30,
    purchasePrice: { credits: 3500 },
  },
  exploration: {
    id: "exploration",
    name: "Exploration Gate Token",
    description: "Venture into uncharted territories",
    icon: "🔍",
    maxInventory: 40,
    purchasePrice: { credits: 2000 },
  },
};

export function TokensDisplay() {
  const { balance, isLoading, purchaseTokens, isPurchasing } = useGateTokens();
  const [selectedToken, setSelectedToken] = useState<"anomaly" | "raid" | "exploration" | null>(null);
  const [purchaseAmount, setPurchaseAmount] = useState(1);

  if (isLoading) {
    return (
      <Card className="border-slate-700 bg-slate-900/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin text-amber-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-slate-700 bg-slate-900/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-amber-400" />
          Gate Tokens
        </CardTitle>
        <CardDescription>
          Access tokens for anomalies, raids, and explorations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {(["anomaly", "raid", "exploration"] as const).map((tokenType) => {
            const config = TOKEN_CONFIGS[tokenType];
            const quantity = balance?.[tokenType] ?? 0;
            const percentage = (quantity / config.maxInventory) * 100;

            return (
              <Dialog key={tokenType}>
                <div
                  key={tokenType}
                  className="rounded-lg border border-slate-700 bg-slate-900/30 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-2xl mb-1">{config.icon}</div>
                      <p className="font-semibold text-sm text-white">
                        {config.name}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        {config.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-semibold text-amber-400">
                          {quantity} / {config.maxInventory}
                        </span>
                        <span className="text-xs text-slate-500">
                          {Math.round(percentage)}%
                        </span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <Badge variant="outline" className="text-xs">
                      {config.purchasePrice.credits} credits each
                    </Badge>

                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          setSelectedToken(tokenType);
                          setPurchaseAmount(1);
                        }}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Purchase
                      </Button>
                    </DialogTrigger>
                  </div>
                </div>

                {selectedToken === tokenType && (
                  <DialogContent className="border-slate-700 bg-slate-900">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <span className="text-2xl">{config.icon}</span>
                        Purchase {config.name}
                      </DialogTitle>
                      <DialogDescription>
                        Current balance: {quantity} / {config.maxInventory}
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Quantity
                        </label>
                        <input
                          type="number"
                          min="1"
                          max={config.maxInventory - quantity}
                          value={purchaseAmount}
                          onChange={(e) =>
                            setPurchaseAmount(
                              Math.max(
                                1,
                                Math.min(
                                  config.maxInventory - quantity,
                                  parseInt(e.target.value) || 1
                                )
                              )
                            )
                          }
                          className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white"
                        />
                      </div>

                      <div className="bg-slate-800/50 rounded p-3 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Unit price:</span>
                          <span className="text-white font-semibold">
                            {config.purchasePrice.credits} credits
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-400">Quantity:</span>
                          <span className="text-white font-semibold">
                            {purchaseAmount}
                          </span>
                        </div>
                        <div className="border-t border-slate-700 pt-2 flex justify-between">
                          <span className="text-amber-400 font-semibold">
                            Total:
                          </span>
                          <span className="text-amber-400 font-semibold">
                            {config.purchasePrice.credits * purchaseAmount}{" "}
                            credits
                          </span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-amber-600 hover:bg-amber-700"
                        onClick={() => {
                          purchaseTokens({ tokenType, quantity: purchaseAmount });
                        }}
                        disabled={isPurchasing}
                      >
                        {isPurchasing ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Purchasing...
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            Confirm Purchase
                          </>
                        )}
                      </Button>
                    </div>
                  </DialogContent>
                )}
              </Dialog>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
