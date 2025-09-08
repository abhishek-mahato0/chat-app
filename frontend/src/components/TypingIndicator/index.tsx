import { useEffect, useState } from "react";

const TypingIndicator = ({ typingUsers }: { typingUsers: Array<string | boolean> }) => {
  const [dots, setDots] = useState(".");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length === 3 ? "." : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const typingUsersList = typingUsers.filter(Boolean);

  if (!typingUsersList || typingUsersList.length === 0) return null;

  return (
    <div className="text-[0.65rem] text-gray-400 pl-18">
      <span>
        {typingUsersList.join(", ")} {typingUsersList.length > 1 ? "are" : "is"} typing{dots}
      </span>
    </div>
  );
};

export default TypingIndicator;
