import { Link } from "react-router-dom";
import ShowAvatar from "../ShowAvatar";
import TypingIndicator from "../TypingIndicator";

export interface LastMessage {
  text: string;
  senderId: string;
  sender: {
    fullname: string;
  };
 id: string;
}
export interface IFriendItemProps {
  id: string;
  avatar?: string;
  fullname: string;
  lastMessage?: LastMessage;
  online: boolean;
  isGroup?: boolean;
  isTyping?: boolean;
  typingUsers?: string[];
}

const FriendItem = ({
  id,
  avatar,
  fullname,
  lastMessage,
  online,
  isGroup = false,
  isTyping = false,
  typingUsers = [],
}: IFriendItemProps) => {
  return (
    <Link
      to={isGroup ? `/chat/?groupId=${id}` : `/chat/?friendId=${id}`}
      className="flex items-center gap-3 bg-[#111418] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#1c1f26] text-white"
    >
      <ShowAvatar avatar={avatar} fullname={fullname} isOnline={online} />
      <div className="flex flex-col justify-center">
        <p className="text-white font-medium line-clamp-1">{fullname}</p>
        {!isTyping ? (
          <p className="text-[#9caaba] text-sm line-clamp-1">{`${lastMessage?.sender.fullname}: ${lastMessage?.text || lastMessage}`}</p>
        ) : (
          isTyping &&
          typingUsers.length > 0 && (
            <TypingIndicator typingUsers={typingUsers} />
          )
        )}
      </div>
    </Link>
  );
};

export default FriendItem;
