import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";

import "./globals.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/pokeapi-js-service-worker.js")
      .then((registration) => {
        console.log("service worker registered for ", registration.scope);
      })
      .catch((error) => {
        console.error("service worker registration failed:", error);
      });
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
