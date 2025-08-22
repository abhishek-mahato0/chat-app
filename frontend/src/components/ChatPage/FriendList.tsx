import { Link } from "react-router-dom";

export interface IFriendItemProps {
  id: string;
  avatar: string;
  fullname: string;
  lastMessage: string;
}

const FriendItem = ({ id, avatar, fullname, lastMessage }: IFriendItemProps) => {
  return (
    <Link
      to={`/chat/?friendId=${id}`}
      className="flex items-center gap-4 bg-[#111418] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#1c1f26] text-white"
    >
      <div
        className="w-14 h-14 rounded-full bg-center bg-cover"
        style={{ backgroundImage: `url(${avatar})` }}
      ></div>
      <div className="flex flex-col justify-center">
        <p className="text-white font-medium line-clamp-1">{fullname}</p>
        <p className="text-[#9caaba] text-sm line-clamp-2">{lastMessage}</p>
      </div>
    </Link>
  );
};

export default FriendItem;
