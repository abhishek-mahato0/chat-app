import { MessageCirclePlus } from "lucide-react";
import { FormComponent } from "../FormInput";
import FriendItem, { type IFriendItemProps } from "./FriendList";
import SuggestedItem, { type ISuggestedItemProps } from "./SuggestedItem";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CreateGroupBody } from "../AddFriends";

interface ISideBarProps {
  friends: Array<IFriendItemProps>;
  suggested: Array<ISuggestedItemProps>;
}

const EmptyFriendList = ({ text }: { text: string }) => {
  return <div className="text-gray-500 text-sm">{text}</div>;
};

const Sidebar = ({ friends, suggested }: ISideBarProps) => {
  return (
    <div className="flex flex-col w-80 gap-4 bg-[#111418] h-full py-6 px-5 overflow-y-auto">
      <div className="flex items-center gap-3 justify-between mb-4">
        <FormComponent
          type="search"
          placeholder="Search..."
          onChange={() => {}}
          value=""
        />
        <Popover>
          <PopoverTrigger>
            <MessageCirclePlus className="w-6 h-6 text-gray-500 cursor-pointer hover:scale-105 hover:text-white" />
          </PopoverTrigger>
          <PopoverContent className="bg-gray-800 border-gray-700">
            <CreateGroupBody friends={friends || []} onCancel={()=>{}} onCreate={()=>{}} />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-white font-bold text-lg">Friends</h2>
        {friends.length === 0 ? (
          <EmptyFriendList text="No Chats Yet." />
        ) : (
          friends.map((f, i) => <FriendItem key={i} {...f} />)
        )}
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-white font-bold text-lg mt-6">Suggested</h2>
        {suggested.length === 0 ? (
          <EmptyFriendList text="No Suggestions Available." />
        ) : (
          suggested.map((s, i) => <SuggestedItem key={i} {...s} />)
        )}
      </div>
    </div>
  );
};

export default Sidebar;
