import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { sepolia, hederaTestnet } from "wagmi/chains";

export const config = getDefaultConfig({
  appName: "PureL",
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || "YOUR_PROJECT_ID",
  chains: [sepolia, hederaTestnet],
  ssr: false, // If your dApp uses server side rendering (SSR)
});
