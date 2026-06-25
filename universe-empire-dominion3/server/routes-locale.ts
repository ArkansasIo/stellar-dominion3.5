import { Router, Request, Response } from "express";
import { getLocale, locales, SupportedLocale } from "../shared/locales/index";

const router = Router();

router.get("/api/locales", (_req: Request, res: Response) => {
  res.json({
    supported: Object.entries(locales).map(([code, info]) => ({
      code,
      name: info.name,
      nativeName: info.nativeName,
    })),
    default: "en",
  });
});

router.get("/api/locale/:locale", (req: Request, res: Response) => {
  const locale = req.params.locale as SupportedLocale;
  if (!Object.keys(locales).includes(locale)) {
    return res.status(400).json({ error: `Unsupported locale: ${locale}` });
  }
  res.json(getLocale(locale));
});

export default router;
