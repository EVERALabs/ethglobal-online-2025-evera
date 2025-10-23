import { useContext } from "react";
import { Web3Context } from "../context/Web3ContextDefinition";
import type { Web3ContextType } from "../context/Web3ContextDefinition";

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider");
  }
  return context;
};
