import { useMemo, useState } from "react";
import { debounce } from "../../hooks/useDebounce";
import TypingIndicator from "../TypingIndicator";

const MessageInput = ({
  sendMessage,
  handleTyping,
  isTyping,
  typingUsers
}: {
  sendMessage: (message: string) => void;
  handleTyping: (isTyping: boolean) => void;
  isTyping: boolean;
  typingUsers: Array<string | boolean>;
}) => {
  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    sendMessage(message);
    setMessage("");
  };

const handleUserTyping = useMemo(
    () =>
      debounce(() => {
        handleTyping(true); // Notify that user is typing
      }, 200),
    [handleTyping]
  );

const handleStopTyping = useMemo(
    () =>
      debounce(() => {
        handleTyping(false); // Notify that user stopped typing
      }, 2000),
    [handleTyping]
  );

  return (
    <>
    <div className="flex items-center gap-3 pt-3 px-3 bg-[#111418]">
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
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
          handleUserTyping();
        }}
        onKeyUp={handleStopTyping}
        className="flex-1 bg-[#283039] text-white rounded-lg px-4 py-3 focus:outline-none placeholder:text-[#9caaba]"
      />
      <button
        className="px-4 py-2 bg-[#0b78f4] text-white rounded-lg font-medium"
        onClick={handleSendMessage}
      >
        Send
      </button>
    </div>
      {isTyping && (
        <TypingIndicator typingUsers={typingUsers} />
      )}
    </>
  );
};

export default MessageInput;
