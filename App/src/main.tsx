import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { Totem } from "./Totem";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Totem />
  </StrictMode>,
);
