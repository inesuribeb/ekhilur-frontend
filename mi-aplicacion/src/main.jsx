import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import  LanguageContextProvider  from "./context/LanguageContext";
import router from "./utils/router";

import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LanguageContextProvider>
      <RouterProvider router={router} />
    </LanguageContextProvider>
  </StrictMode>
);
