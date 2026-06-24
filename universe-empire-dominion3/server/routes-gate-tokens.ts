import { Router, type Request, type Response } from "express";
import { gateTokensService } from "./services/gateTokensService";
import { TokenType, isValidTokenType } from "../shared/config/gateTokensConfig";
import { isAuthenticated as requireAuth } from "./basicAuth";

const router = Router();

/**
 * GET /api/gate-tokens/balance
 * Get all token balances for the current user
 */
router.get("/balance", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const balances = await gateTokensService.getAllTokenBalances(userId);
    res.json({ success: true, balances });
  } catch (error) {
    console.error("Failed to get token balance:", error);
    res.status(500).json({ success: false, error: "Failed to get token balance" });
  }
});

/**
 * GET /api/gate-tokens/:tokenType
 * Get balance for a specific token type
 */
router.get("/:tokenType", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { tokenType } = req.params;

    if (!isValidTokenType(tokenType)) {
      return res.status(400).json({ success: false, error: "Invalid token type" });
    }

    const balance = await gateTokensService.getTokenBalance(userId, tokenType as TokenType);
    res.json({ success: true, tokenType, balance });
  } catch (error) {
    console.error("Failed to get token balance:", error);
    res.status(500).json({ success: false, error: "Failed to get token balance" });
  }
});

/**
 * POST /api/gate-tokens/consume
 * Consume a token when entering content
 */
router.post("/consume", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { tokenType, source, metadata } = req.body;

    if (!isValidTokenType(tokenType)) {
      return res.status(400).json({ success: false, error: "Invalid token type" });
    }

    if (!source) {
      return res.status(400).json({ success: false, error: "Source is required" });
    }

    const result = await gateTokensService.consumeToken(userId, tokenType, source, metadata);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    const newBalance = await gateTokensService.getTokenBalance(userId, tokenType);
    res.json({ success: true, newBalance });
  } catch (error) {
    console.error("Failed to consume token:", error);
    res.status(500).json({ success: false, error: "Failed to consume token" });
  }
});

/**
 * POST /api/gate-tokens/purchase
 * Purchase tokens with credits
 */
router.post("/purchase", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { tokenType, quantity } = req.body;

    if (!isValidTokenType(tokenType)) {
      return res.status(400).json({ success: false, error: "Invalid token type" });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ success: false, error: "Quantity must be positive" });
    }

    const result = await gateTokensService.purchaseTokens(userId, tokenType, quantity);
    
    if (!result.success) {
      return res.status(400).json(result);
    }

    res.json({ success: true, newBalance: result.newBalance });
  } catch (error) {
    console.error("Failed to purchase tokens:", error);
    res.status(500).json({ success: false, error: "Failed to purchase tokens" });
  }
});

/**
 * GET /api/gate-tokens/history
 * Get token transaction history
 */
router.get("/history", requireAuth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const limit = Math.min(parseInt(req.query.limit as string) || 50, 100);
    const offset = parseInt(req.query.offset as string) || 0;

    const history = await gateTokensService.getTokenHistory(userId, limit, offset);
    res.json({ success: true, history });
  } catch (error) {
    console.error("Failed to get token history:", error);
    res.status(500).json({ success: false, error: "Failed to get token history" });
  }
});

export function registerGateTokenRoutes(app: any) {
  app.use("/api/gate-tokens", router);
}
