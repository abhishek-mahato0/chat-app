import type { Message } from ".";
import ShowAvatar from "../ShowAvatar";

interface IMessageItemProps extends Message {
  isOwn: boolean;
  senderName: string;
}

const MessageItem = ({
  avatar,
  fullname,
  text,
  isOwn,
  senderName,
}: IMessageItemProps) => {
  return (
    <div
      className={`flex gap-3 items-center ${
        isOwn ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwn && <ShowAvatar avatar={avatar} fullname={senderName} />}
      <div className="flex flex-col gap-1 max-w-[360px]">
        <p
          className={`px-4 py-3 rounded-lg text-white ${
            isOwn ? "bg-[#0b78f4] self-end" : "bg-[#283039]"
          }`}
        >
          {text}
        </p>
      </div>
      {isOwn && <ShowAvatar avatar={avatar} fullname={fullname} />}
    </div>
  );
};

export default MessageItem;
