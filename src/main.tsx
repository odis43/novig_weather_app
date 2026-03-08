import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { TemperatureProvider } from "./context/TemperatureContext.tsx";

createRoot(document.getElementById("root")!).render(
  <TemperatureProvider>
    <App />
  </TemperatureProvider>,
);
