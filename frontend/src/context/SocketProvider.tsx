/* eslint-disable @typescript-eslint/no-explicit-any */
// src/context/SocketProvider.tsx
import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { SocketContext } from "./utils";

export interface ChatMessage {
  message: string;
  roomId?: string;
  toUserId?: string;
  from?: string;
  createdAt?: string | Date;
}

export interface ISocketContext {
  joinRoom: (roomId?: string, userId?: string) => void;
  sendMessage: (roomId: string, msg: string, toUserId: string) => void;
  onMessage: (callback: (msg: any) => void) => void;
  onPreviousMessages: (callback: (msgs: ChatMessage[]) => void) => void;
  disconnectSocket: () => void;
}

export const SocketProvider = ({
  children,
  userId,
}: {
  children: React.ReactNode;
  userId: string;
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const _socket = io("http://localhost:8080", {
      auth: { userId }, // optional, can be read on server via socket.handshake.auth.userId
    });

    _socket.on("connect", () => {
      console.log("Socket connected:", _socket.id);
      _socket.emit("user:online", userId); // now it will send userId properly
    });

    setSocket(_socket);

    return () => {
      _socket.disconnect();
    };
  }, [userId]);

  const joinRoom = useCallback(
    (roomId?: string, toUserId?: string) => {
      if (!socket) return;
      socket.emit("join:room", { roomId, toUserId });
    },
    [socket]
  );

  const sendMessage = useCallback(
    (text: string, roomId?: string, toUserId?: string) => {
      socket?.emit("event:message", { roomId, text, toUserId });
    },
    [socket]
  );

  const onMessage = useCallback(
    (callback: (msg: any) => void) => {
      const handler = (msg: ChatMessage[]) => callback(msg);
      socket?.on("event:message", handler);
      return () => socket?.off("event:message", handler);
    },
    [socket]
  );

  const onPreviousMessages = useCallback(
    (callback: (msgs: ChatMessage[]) => void) => {
      if (!socket) return;
      const handler = (msgs: ChatMessage[]) => callback(msgs);
      socket.on("previous:messages", handler);
      return () => socket.off("previous:messages", handler);
    },
    [socket]
  );

  // Optional: disconnect socket manually
  const disconnectSocket = useCallback(() => {
    socket?.disconnect();
    setSocket(null);
  }, [socket]);

  return (
    <SocketContext.Provider
      value={{
        joinRoom,
        sendMessage,
        onMessage,
        onPreviousMessages,
        disconnectSocket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
