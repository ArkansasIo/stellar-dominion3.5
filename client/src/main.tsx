import { createRoot } from "react-dom/client";
import { Router as WouterRouter } from "wouter";
import App from "./App";
import "./index.css";

const CHUNK_RELOAD_KEY = "stellar-dominion:chunk-reload";

// A rolling deployment can leave an open tab with an old hashed chunk name.
// Vite emits this event when that chunk cannot be imported. Reload once so the
// browser obtains the current index.html and its matching asset manifest.
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  if (sessionStorage.getItem(CHUNK_RELOAD_KEY) === "1") {
    console.error("Unable to load the current application module after a refresh.", event);
    return;
  }

  sessionStorage.setItem(CHUNK_RELOAD_KEY, "1");
  window.location.reload();
});

window.addEventListener("load", () => {
  sessionStorage.removeItem(CHUNK_RELOAD_KEY);
});

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Stellar Dominion root element is missing");
}

// Wouter needs to ignore the repository prefix when the app is hosted at
// https://arkansasio.github.io/stellar-dominion3.5/.
// Vite supplies the same prefix through BASE_URL during the Pages build.
const routerBase = import.meta.env.BASE_URL.replace(/\/$/, "");

createRoot(rootElement).render(
  <WouterRouter base={routerBase}>
    <App />
  </WouterRouter>,
);
