import { Link } from "react-router-dom";
import ShowAvatar from "../ShowAvatar";

export interface IFriendItemProps {
  id: string;
  avatar?: string;
  fullname: string;
  lastMessage?: string;
  online: boolean;
  isGroup?: boolean;
}

const FriendItem = ({ id, avatar, fullname, lastMessage, online, isGroup = false }: IFriendItemProps) => {
  return (
    <Link
      to={isGroup ? `/chat/?groupId=${id}`:`/chat/?friendId=${id}`}
      className="flex items-center gap-3 bg-[#111418] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#1c1f26] text-white"
    >
      <ShowAvatar avatar={avatar} fullname={fullname} isOnline={online} />
      <div className="flex flex-col justify-center">
        <p className="text-white font-medium line-clamp-1">{fullname}</p>
        <p className="text-[#9caaba] text-sm line-clamp-2">{lastMessage}</p>
      </div>
    </Link>
  );
};

export default FriendItem;
