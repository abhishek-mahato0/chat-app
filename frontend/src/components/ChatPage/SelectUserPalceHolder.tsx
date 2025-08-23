import { MessageCircle } from "lucide-react";

const SelectUserPlaceholder = () => {
  return (
    <div className="flex flex-1 justify-center items-center text-[#9caaba] text-lg h-[90%] w-full">
      <div className="flex flex-col gap-4 items-center justify-center">
        <MessageCircle className="text-white w-10 h-10" />
        <p>Select a user or group to chat with</p>
      </div>
    </div>
  );
};

export default SelectUserPlaceholder;
