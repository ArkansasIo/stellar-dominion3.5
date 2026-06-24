import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export interface TokenBalance {
  anomaly: number;
  raid: number;
  exploration: number;
}

export interface TokenConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  maxInventory: number;
  purchasePrice: { credits: number };
}

export const useGateTokens = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get current token balance
  const balanceQuery = useQuery({
    queryKey: ["gateTokens", "balance"],
    queryFn: async () => {
      const response = await fetch("/api/gate-tokens/balance", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch token balance");
      const data = await response.json();
      return data.balances as TokenBalance;
    },
  });

  // Consume token mutation
  const consumeTokenMutation = useMutation({
    mutationFn: async ({
      tokenType,
      source,
      metadata,
    }: {
      tokenType: "anomaly" | "raid" | "exploration";
      source: string;
      metadata?: Record<string, any>;
    }) => {
      const response = await fetch("/api/gate-tokens/consume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tokenType, source, metadata }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to consume token");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gateTokens"] });
      toast({
        title: "Token Consumed",
        description: "You have successfully consumed a gate token.",
      });
    },
    onError: (error) => {
      toast({
        title: "Token Consumption Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Purchase tokens mutation
  const purchaseTokensMutation = useMutation({
    mutationFn: async ({
      tokenType,
      quantity,
    }: {
      tokenType: "anomaly" | "raid" | "exploration";
      quantity: number;
    }) => {
      const response = await fetch("/api/gate-tokens/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ tokenType, quantity }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to purchase tokens");
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["gateTokens"] });
      toast({
        title: "Purchase Successful",
        description: `You purchased tokens successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Purchase Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    balance: balanceQuery.data,
    isLoading: balanceQuery.isLoading,
    isError: balanceQuery.isError,
    consumeToken: consumeTokenMutation.mutate,
    isConsuming: consumeTokenMutation.isPending,
    purchaseTokens: purchaseTokensMutation.mutate,
    isPurchasing: purchaseTokensMutation.isPending,
  };
};
