
interface IFriendCardProps {
  avatar: string;
  name: string;
  username: string;
}

const FriendCard = ({ avatar, name, username }: IFriendCardProps) => {
  return (
    <div className="flex items-center gap-4 bg-[#111418] px-4 py-3 rounded-lg mb-4">
      <div className="relative">
        <div
          className="w-16 h-16 rounded-full bg-cover relative border-2 border-white"
          style={{ backgroundImage: `url(${avatar})` }}
        ></div>
        <div className="z-10 bg-green-700 w-3 h-3 rounded-full border-2 border-white bottom-[3px] absolute right-2" />
      </div>
      <div>
        <p className="font-medium text-white">{name}</p>
        <p className="text-[#9caaba] text-sm">{username}</p>
      </div>
    </div>
  );
};

export default FriendCard;
