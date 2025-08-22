import FriendItem, { type IFriendItemProps } from "./FriendList";
import SuggestedItem, { type ISuggestedItemProps } from "./SuggestedItem";

interface ISideBarProps {
    friends: Array<IFriendItemProps>;
    suggested: Array<ISuggestedItemProps>;
}

const Sidebar = ({ friends, suggested }: ISideBarProps) => {
    console.log(friends, suggested);
  return (
    <div className="flex flex-col w-80 gap-4 bg-[#111418] h-full p-4 overflow-y-auto">
      <h2 className="text-white font-bold text-lg">Friends</h2>
      {friends.map((f, i) => <FriendItem key={i} {...f} />)}
      <h2 className="text-white font-bold text-lg mt-6">Suggested</h2>
      {suggested.map((s, i) => <SuggestedItem key={i} {...s} />)}
    </div>
  );
};

export default Sidebar;
