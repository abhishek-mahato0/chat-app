import { useState } from "react";

const MessageInput = ({
  sendMessage,
}: {
  sendMessage: (message: string) => void;
}) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage("");
  };

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
        onChange={(e) => setMessage(e.target.value)}
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
