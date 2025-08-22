/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback, useRef } from "react";
import { gql, useQuery } from "@apollo/client";
import { SocketProvider } from "../../context/SocketProvider";
import { useSocket } from "../../context/utils";
import Sidebar from "./SideBar";
import ChatBox from "./ChatBox";
import { useSearchParams } from "react-router-dom";

export interface User {
  id: string;
  fullname: string;
  username: string;
  email: string;
  avatar?: string;
}
export interface Message {
  senderId: string;
  text: string;
  from?: string;
  message?: string;
  avatar?: string;
  fullname?: string;
}

const GET_ALL_USERS = gql`
  query GetAllUsers($id: ID!) {
    getAllUsers(id: $id) {
      id
      fullname
      username
      email
    }
  }
`;

export const ChatPageInner = () => {
  const { joinRoom, sendMessage, onMessage, onPreviousMessages } = useSocket();
  const [friendId] = useSearchParams();
  const selectedUserId = friendId.get("friendId") || "";
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});

  const userId = localStorage.getItem("userId")!;
  const { data } = useQuery(GET_ALL_USERS, { variables: { id: userId } });

  const handlePreviousMessages = useCallback(
    (msgs: any[]) => {
      if (!selectedUser) return;
      setMessagesMap((prev) => ({
        ...prev,
        [selectedUserId]: msgs,
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
  }, [onMessage]);

  useEffect(() => {
    onPreviousMessages(handlePreviousMessages);
  }, [onPreviousMessages, handlePreviousMessages]);

  useEffect(() => {
    if (selectedUserId) joinRoom(undefined, selectedUserId);
  }, [selectedUserId, joinRoom]);

  const handleSend = (input: string) => {
    if (!input.trim() || !selectedUserId) return;
    sendMessage(input, "", selectedUserId);

    setMessagesMap((prev) => ({
      ...prev,
      [selectedUserId]: [
        ...(prev[selectedUserId] || []),
        { senderId: userId, text: input },
      ],
    }));
  };

  useEffect(() => {
    if (friendId.get("friendId")) {
      setSelectedUser(data?.getAllUsers.find((u: User) => u.id === friendId.get("friendId")));
    }
  }, [data?.getAllUsers, friendId]);

  return (
    <div className="flex min-h-screen bg-[#111418] text-white">
      {/* Sidebar */}
      <Sidebar friends={data?.getAllUsers || []} suggested={[]} />
      {/* <div className="w-1/4 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4 text-gray-200">Users</h2>
        <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin scrollbar-thumb-gray-600">
          {(data?.getAllUsers || []).map((u: User) => (
            <div
              key={u.id}
              className={`flex items-center p-2 cursor-pointer rounded-lg transition ${
                selectedUser === u.id
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-300"
              }`}
              onClick={() => setSelectedUser(u.id)}
            >
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center mr-3 font-semibold">
                {u.fullname[0]}
              </div>
              <span className="truncate">{u.fullname}</span>
            </div>
          ))}
        </div>
      </div> */}

      <div className="flex-1">
        {/* Right chat area */}
        <ChatBox
          selectedUser={selectedUser}
          messages={messagesMap[selectedUserId] || []}
          userId={userId}
          sendMessage={handleSend}
        />
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
