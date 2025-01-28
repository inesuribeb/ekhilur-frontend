import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import  LanguageContextProvider  from "./context/LanguageContext";
import LoginContextProvider from "./context/LoginContext";
import router from "./utils/router";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoginContextProvider>
      <LanguageContextProvider>
        <RouterProvider router={router} />
      </LanguageContextProvider>
    </LoginContextProvider>
  </StrictMode>
);
