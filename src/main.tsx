import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider } from "@/context/theme-context.tsx";
import { Provider } from "react-redux";
import { store } from "@/redux/store.ts";
import { AuthInitializer } from "./lib/auth-initializer.tsx";
import { HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <Provider store={store}>
          <AuthInitializer>
            <App />
          </AuthInitializer>
        </Provider>
      </ThemeProvider>
    </HelmetProvider>
  </StrictMode>
);
