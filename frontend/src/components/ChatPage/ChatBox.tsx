import MessageItem from "./MessageItem";
import MessageInput from "./MessageInput";
import SelectUserPlaceholder from "./SelectUserPalceHolder";
import type { IRoom, Message, User } from ".";
import { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ChatBox = ({
  selectedGroup,
  selectedUser,
  messages,
  userId,
  sendMessage,
  handleTyping,
  isTyping,
  typingUsers
}: {
  selectedGroup: IRoom | null;
  selectedUser: User | null;
  messages: Message[];
  userId: string;
  sendMessage: (message: string) => void;
  handleTyping: (isTyping: boolean) => void;
  isTyping: boolean;
  typingUsers: Array<string | boolean>;
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedUser]);

  if (!selectedUser && !selectedGroup) return <SelectUserPlaceholder />;
  return (
    <div className="flex flex-col flex-1 md:h-screen h-full pb-8 overflow-hidden">
      <div className="p-4 border-b border-b-gray-700 flex items-center gap-3">
        <Avatar>
          <AvatarImage src={selectedUser?.avatar} alt={selectedUser?.fullname || selectedGroup?.name} />
          <AvatarFallback>
            {selectedUser?.fullname?.[0] || selectedGroup?.name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <h2 className="text-xl font-bold">{selectedUser?.fullname || selectedGroup?.name}</h2>
          <p className="text-gray-400">{selectedUser?.email}</p>
          <p className="text-gray-400">{selectedGroup?.users?.length}</p>
        </div>
      </div>
      <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
        {messages.map((m, i) => {
          const isMe = (m.senderId || m.from) === userId;
          return <MessageItem key={i} {...m} isOwn={isMe} fullname={m?.sender?.fullname || ""} senderName={m?.sender?.fullname || ""} />;
        })}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput sendMessage={sendMessage} handleTyping={handleTyping} isTyping={isTyping} typingUsers={typingUsers} />
    </div>
  );
};

export default ChatBox;
