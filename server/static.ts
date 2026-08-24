import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const serverEntry = process.argv[1] || process.cwd();
  
  // Try multiple possible paths for the dist directory
  const possiblePaths = [
    path.resolve(path.dirname(serverEntry), "public"),
    path.resolve(path.dirname(serverEntry), "dist", "public"),
    path.resolve(process.cwd(), "dist", "public"),
    path.resolve(process.cwd(), "public"),
  ];
  
  let distPath: string | null = null;
  for (const testPath of possiblePaths) {
    if (fs.existsSync(testPath)) {
      distPath = testPath;
      console.log(`[static] Found client build at: ${distPath}`);
      break;
    }
  }
  
  if (!distPath) {
    console.error(`[static] Could not find client build in any of these locations:`);
    possiblePaths.forEach(p => console.error(`  - ${p}`));
    throw new Error(
      `Could not find the build directory, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // Never return the SPA HTML document for a missing static asset. Doing so gives
  // browsers an HTML MIME type for a JavaScript module and surfaces as
  // "Importing a module script failed" instead of an actionable 404.
  app.use("*", (req, res, next) => {
    const pathname = req.originalUrl.split("?", 1)[0];
    if (/\.[^/]+$/.test(pathname)) {
      res.status(404).type("text/plain").send("Static asset not found");
      return;
    }
    next();
  });

  // Fall through to index.html for client-side application routes only.
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath!, "index.html"));
  });
}
