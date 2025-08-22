/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useRef } from "react";
import { gql, useQuery } from "@apollo/client";
import { SocketProvider } from "../../context/SocketProvider";
import { useSocket } from "../../context/utils";

interface User {
  id: string;
  firstName: string;
  lastName: string;
}
interface Message {
  senderId: string;
  content: string;
  from?: string;
  message?:string;
}

const GET_ALL_USERS = gql`
  query GetAllUsers($id: ID!) {
    getAllUsers(id: $id) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const ChatPageInner = () => {
  const { joinRoom, sendMessage, onMessage, onPreviousMessages } = useSocket();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userId = localStorage.getItem("userId")!;
  const { data } = useQuery(GET_ALL_USERS, { variables: { id: userId } });


  const handlePreviousMessages = useCallback(
    (msgs: any[]) => {
      if (!selectedUser) return;
      setMessagesMap((prev) => ({
        ...prev,
        [selectedUser]: msgs,
      }));
    },
    [selectedUser]
  );

  // Listen for new messages
  useEffect(() => {
    const handleMessage = (msg: any) => {
      const target = msg.from || msg.roomId || msg.senderId;
      setMessagesMap((prev) => ({
        ...prev,
        [target]: [...(prev[target] || []), msg],
      }));
    };
    onMessage(handleMessage);
    onPreviousMessages(handlePreviousMessages);
  }, [onMessage, onPreviousMessages, handlePreviousMessages]);

  // Join room when selectedUser changes
  useEffect(() => {
    if (selectedUser) joinRoom(undefined, selectedUser);
  }, [selectedUser, joinRoom]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesMap, selectedUser]);

  const handleSend = () => {
    if (!input.trim() || !selectedUser) return;
    sendMessage(input, "", selectedUser);

    // Optimistic update
    setMessagesMap((prev) => ({
      ...prev,
      [selectedUser]: [
        ...(prev[selectedUser] || []),
        { senderId: userId, content: input },
      ],
    }));
    setInput("");
  };
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Users list */}
      <div className="w-1/4 bg-white border-r p-4 flex flex-col">
        <h2 className="text-xl font-semibold mb-4">Users</h2>
        <div className="flex-1 overflow-y-auto">
          {(data?.getAllUsers || []).map((u: User) => (
            <div
              key={u.id}
              className={`flex items-center p-2 mb-1 cursor-pointer rounded-lg hover:bg-gray-200 ${
                selectedUser === u.id
                  ? "bg-blue-500 text-white"
                  : "text-gray-800"
              }`}
              onClick={() => setSelectedUser(u.id)}
            >
              <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-2 text-white">
                {u.firstName[0]}
              </div>
              <span>{u.firstName + " " + u.lastName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col">
        {/* Chat header */}
        <div className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
          <h2 className="text-lg font-semibold">
            {selectedUser
              ? data?.getAllUsers.find((u: User) => u.id === selectedUser)
                  ?.firstName
              : "Select a user"}
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {selectedUser &&
            (messagesMap[selectedUser] || []).map((m, i) => {
              const isMe = (m.senderId || m.from) === userId;
              return (
                <div
                  key={i}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg max-w-xs break-words ${
                      isMe ? "bg-blue-500 text-white" : "bg-white text-gray-800"
                    }`}
                  >
                    {m.content || m.message}
                  </div>
                </div>
              );
            })}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {selectedUser && (
          <div className="flex p-4 bg-white border-t">
            <input
              type="text"
              placeholder="Type a message..."
              className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-full transition"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const ChatPage = () => {
  const userId = localStorage.getItem("userId")!;
  return (
    <SocketProvider userId={userId}>
      <ChatPageInner />
    </SocketProvider>
  );
};
