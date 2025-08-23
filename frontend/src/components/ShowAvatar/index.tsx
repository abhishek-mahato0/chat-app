import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface IAvatarProps {
  avatar?: string;
  fullname?: string;
  isOnline?: boolean;
}
const ShowAvatar = ({ avatar, fullname, isOnline }: IAvatarProps) => {
  return (
    <div className="relative">
      <Avatar>
        <AvatarImage src={avatar} alt={fullname} />
        <AvatarFallback>{fullname?.[0] || ""}</AvatarFallback>
      </Avatar>
      {isOnline && (
        <div className="bg-green-700 h-3 w-3 rounded-full border-2 border-[#111418] absolute bottom-0 right-0"></div>
      )}
    </div>
  );
};

export default ShowAvatar;
