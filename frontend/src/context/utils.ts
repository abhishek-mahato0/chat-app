// src/context/socketUtils.ts
import { createContext, useContext } from "react";
import type { ISocketContext } from "./SocketProvider";

export const SocketContext = createContext<ISocketContext | null>(null);

export const useSocket = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("Socket not available");
  return ctx;
};
