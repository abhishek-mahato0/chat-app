interface IMessageItemProps {
    avatar: string;
    name: string;
    text: string;
    isOwn: boolean;
}

const MessageItem = ({ avatar, name, text, isOwn }: IMessageItemProps) => {
  return (
    <div className={`flex gap-3 ${isOwn ? "justify-end" : "justify-start"}`}>
      {!isOwn && (
        <div
          className="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url(${avatar})` }}
        ></div>
      )}
      <div className="flex flex-col gap-1 max-w-[360px]">
        {!isOwn && <p className="text-[#9caaba] text-[13px]">{name}</p>}
        <p className={`px-4 py-3 rounded-lg text-white ${isOwn ? "bg-[#0b78f4] self-end" : "bg-[#283039]"}`}>
          {text}
        </p>
      </div>
      {isOwn && (
        <div
          className="w-10 h-10 rounded-full bg-cover bg-center shrink-0"
          style={{ backgroundImage: `url(${avatar})` }}
        ></div>
      )}
    </div>
  );
};

export default MessageItem;
