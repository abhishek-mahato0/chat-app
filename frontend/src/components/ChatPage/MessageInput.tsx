import { useMemo, useState } from "react";
import { debounce } from "../../hooks/useDebounce";

const MessageInput = ({
  sendMessage,
  handleTyping,
}: {
  sendMessage: (message: string) => void;
  handleTyping: () => void;
}) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage("");
  };

const handleUserTyping = useMemo(
    () =>
      debounce(() => {
        handleTyping(); // Notify that user is typing
      }, 500),
    [handleTyping]
  );

  return (
    <div className="flex items-center gap-3 p-4 bg-[#111418]">
      <div
        className="w-10 h-10 rounded-full bg-cover bg-center"
        style={{
          backgroundImage: `url("https://randomuser.me/api/portraits/men/45.jpg")`,
        }}
      ></div>
      <input
        placeholder="Type a message"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          handleUserTyping();
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        className="flex-1 bg-[#283039] text-white rounded-lg px-4 py-3 focus:outline-none placeholder:text-[#9caaba]"
      />
      <button
        className="px-4 py-2 bg-[#0b78f4] text-white rounded-lg font-medium"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
