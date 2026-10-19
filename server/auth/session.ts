import type { Request, Response } from "express";

export function establishLoginSession(req: Request, res: Response, userId: string): void {
  req.session.userId = userId;
  res.setHeader("Cache-Control", "no-store");
}

export function clearLoginSession(req: Request, res: Response): void {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    res.setHeader("Cache-Control", "no-store");
    res.status(204).end();
  });
}
