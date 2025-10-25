import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./index.css";
import "@rainbow-me/rainbowkit/styles.css";
import { AuthProvider } from "./context/AuthContext";
import { Web3Provider } from "./context/Web3Context";
import { queryClient } from "./lib/queryClient";
import { config } from "./lib/wagmi";
import { RouterProvider } from "react-router-dom";
import router from "./router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <Web3Provider>
            <AuthProvider>
              <RouterProvider router={router} />
              {/* <ReactQueryDevtools initialIsOpen={false} /> */}
            </AuthProvider>
          </Web3Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </StrictMode>
);
