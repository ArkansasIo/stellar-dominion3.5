import { createRoot } from "react-dom/client";
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

createRoot(rootElement).render(<App />);
