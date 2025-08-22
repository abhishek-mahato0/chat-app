import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import SelectUserPlaceholder from "./SelectUserPalceHolder";
import type { Message, User } from ".";
import { useEffect, useRef } from "react";

const ChatBox = ({
  selectedUser,
  messages,
  userId,
  sendMessage
}: {
  selectedUser: User | null;
  messages: Message[];
  userId: string;
  sendMessage: (message: string) => void;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  if (!selectedUser) return <SelectUserPlaceholder />;
  return (
    <div className="flex flex-col flex-1 h-full">
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        {messages.map((m, i) => {
          const isMe = (m.senderId || m.from) === userId;
          return <MessageItem key={i} {...m} isOwn={isMe} />;
        })}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatBox;
