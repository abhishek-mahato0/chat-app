/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, useCallback } from "react";
import { gql, useQuery } from "@apollo/client";
import { SocketProvider } from "../../context/SocketProvider";
import { useSocket } from "../../context/utils";
import Sidebar from "./SideBar";
import ChatBox from "./ChatBox";
import { useSearchParams } from "react-router-dom";

export interface IRoom {
  id: string;
  name: string;
  isGroup: boolean;
  users: User[];
}

export interface User {
  id?: string;
  fullname: string;
  username?: string;
  email?: string;
  avatar?: string;
}
export interface Message {
  senderId: string;
  text: string;
  from?: string;
  message?: string;
  avatar?: string;
  fullname?: string;
  sender?: User;
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

const GET_ROOMS_FOR_USER = gql`
  query GetRoomsForUser($userId: ID!) {
    getRoomsForUser(userId: $userId) {
      id
      name
      isGroup
      users {
        id
        fullname
        username
        email
      }
    }
  }
`;

export const ChatPageInner = ({
  userId,
  fullname,
}: {
  userId: string;
  fullname: string;
}) => {
  const {
    joinRoom,
    sendMessage,
    onMessage,
    onPreviousMessages,
    onOnlineUsers,
    handleTyping,
    isTyping,
  } = useSocket();
  const [params] = useSearchParams();
  const selectedUserId = params.get("friendId") || "";
  const selectedGroupId = params.get("groupId") || "";
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedGroup, setSelectedGroup] = useState<IRoom | null>(null);
  const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>({});
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isTypingMaps, setIsTypingMaps] = useState<
    Record<string, { isTyping: boolean; users: string[] }>
  >({});
  const { data } = useQuery(GET_ALL_USERS, { variables: { id: userId } });
  const { data: groupData } = useQuery(GET_ROOMS_FOR_USER, {
    variables: { userId },
  });

  const handlePreviousMessages = useCallback(
    (msgs: any[]) => {
      console.log("Previous messages:", msgs);
      if (!msgs) return;
      setMessagesMap((prev) => ({
        ...prev,
        [selectedUserId || selectedGroupId]: msgs,
      }));
    },
    [selectedGroupId, selectedUserId]
  );

  // Listen for new messages
  useEffect(() => {
    const handleMessage = (msg: any) => {
      const target = (selectedUserId ? msg.senderId : msg.roomId) as string;
      if (!target) return;
      setMessagesMap((prev) => ({
        ...prev,
        [target]: [...(prev[target] || []), msg],
      }));
    };
    onMessage(handleMessage);
  }, [onMessage]);

  useEffect(() => {
    if (!selectedGroupId && !selectedUserId) return;
    onPreviousMessages(handlePreviousMessages);
  }, [
    onPreviousMessages,
    handlePreviousMessages,
    selectedGroupId,
    selectedUserId,
  ]);

  useEffect(() => {
    if (selectedUserId) joinRoom(undefined, selectedUserId);
    if (selectedGroupId) joinRoom(selectedGroupId, undefined);
  }, [selectedUserId, joinRoom, selectedGroupId]);

  const handleSend = (input: string) => {
    if (!input.trim() || (!selectedUserId && !selectedGroupId)) return;
    sendMessage(input, selectedGroupId, selectedUserId);

    setMessagesMap((prev) => ({
      ...prev,
      [selectedUserId || selectedGroupId]: [
        ...(prev[selectedUserId || selectedGroupId] || []),
        {
          senderId: userId,
          text: input,
          sender: {
            fullname: fullname,
          },
        },
      ],
    }));
  };

  useEffect(() => {
    onOnlineUsers(setOnlineUsers);
  }, [onOnlineUsers]);

  useEffect(() => {
    if (selectedUserId) {
      setSelectedUser(
        data?.getAllUsers.find((u: User) => u.id === selectedUserId)
      );
      setSelectedGroup(null);
    } else if (selectedGroupId) {
      setSelectedGroup(
        groupData?.getRoomsForUser.find((u: IRoom) => u?.id === selectedGroupId)
      );
      setSelectedUser(null);
    }
  }, [
    data?.getAllUsers,
    selectedUserId,
    selectedGroupId,
    groupData?.getRoomsForUser,
  ]);

  useEffect(() => {
    if (!selectedUserId && !selectedGroupId) return;
    isTyping((data) => {
      const targetId = selectedUserId ? data.userId : data.roomId;
      if (targetId !== (selectedUserId || selectedGroupId)) return;
      setIsTypingMaps((prev) => ({
        ...prev,
        [targetId]: {
          isTyping: data.isTyping,
          users: selectedGroupId
            ? Array.from(
                new Set([
                  ...(isTypingMaps[selectedGroupId]?.users || []),
                  data.fullName,
                ])
              )
            : [data.fullName],
        },
      }));
    });
  }, [isTyping, isTypingMaps, selectedGroupId, selectedUserId]);

  console.log(isTypingMaps, "istypingmaps");

  // useEffect(() => {
  //   setTimeout(() => {
  //     if (!isTypingMaps[selectedUserId || selectedGroupId]?.isTyping) {
  //       setIsTypingMaps((prev) => ({
  //         ...prev,
  //         [selectedUserId || selectedGroupId]: {
  //           isTyping: false,
  //           users: [],
  //         },
  //       }));
  //     }
  //   }, 2000);
  // }, [isTypingMaps, selectedGroupId, selectedUserId]);

  return (
    <div className="flex min-h-screen bg-[#111418] text-white">
      {/* Sidebar */}
      <Sidebar
        onlineUsers={onlineUsers}
        friends={data?.getAllUsers || []}
        suggested={[]}
        groupChats={groupData?.getRoomsForUser || []}
      />
      <div className="flex-1 border-l-[1px] border-l-gray-700">
        {/* Right chat area */}
        <ChatBox
          selectedGroup={selectedGroup}
          selectedUser={selectedUser}
          messages={messagesMap[selectedUserId || selectedGroupId] || []}
          userId={userId}
          sendMessage={handleSend}
          handleTyping={() =>
            handleTyping(
              true,
              selectedUserId ? false : true,
              selectedUserId || selectedGroupId
            )
          }
          isTyping={
            isTypingMaps[selectedUserId || selectedGroupId]?.isTyping || false
          }
          typingUsers={
            isTypingMaps[selectedUserId || selectedGroupId]?.users || []
          }
        />
      </div>
    </div>
  );
};

export const ChatPage = () => {
  const userId = localStorage.getItem("userId")!;
  const fullname =
    JSON.parse(localStorage.getItem("user") as string)?.fullname || "";
  return (
    <SocketProvider userId={userId} fullName={fullname}>
      <ChatPageInner userId={userId} fullname={fullname} />
    </SocketProvider>
  );
};
