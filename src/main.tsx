import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "antd/dist/reset.css";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ConfigProvider } from "antd";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfigProvider theme={{token:{
      colorPrimary: '#f65f42',
      colorLink: '#f65f42'
    }
    }}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>
);
