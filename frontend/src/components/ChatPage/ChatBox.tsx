import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import SelectUserPlaceholder from "./SelectUserPalceHolder";
import type { Message, User } from ".";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

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
    <div className="flex flex-col flex-1 md:h-screen h-full overflow-hidden">
      <div className="p-4 border-b border-b-gray-700 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={selectedUser?.avatar} alt={selectedUser.fullname} />
          <AvatarFallback>
            {selectedUser.fullname[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">{selectedUser.fullname}</h2>
          <p className="text-gray-400">{selectedUser.email}</p>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        {messages.map((m, i) => {
          const isMe = (m.senderId || m.from) === userId;
          console.log(m, isMe);
          return <MessageItem key={i} {...m} isOwn={isMe} fullname={selectedUser?.fullname || ""} senderName={m?.sender?.fullname || ""} />;
        })}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatBox;
