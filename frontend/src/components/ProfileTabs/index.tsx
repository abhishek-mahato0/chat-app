import { useState } from "react";

const Tabs = ({ children }: {
    children: (activeTab: string) => React.ReactNode;
}) => {
  const [activeTab, setActiveTab] = useState("posts");

  return (
    <div className="w-full max-w-3xl mx-auto mt-8 px-4">
      <div className="flex border-b border-[#3b4754]">
        <button
          onClick={() => setActiveTab("posts")}
          className={`flex-1 py-3 text-center font-bold border-b-2 ${
            activeTab === "posts" ? "border-white text-white" : "border-transparent text-[#9caaba]"
          }`}
        >
          Posts
        </button>
        <button
          onClick={() => setActiveTab("friends")}
          className={`flex-1 py-3 text-center font-bold border-b-2 ${
            activeTab === "friends" ? "border-white text-white" : "border-transparent text-[#9caaba]"
          }`}
        >
          Friends
        </button>
      </div>

      <div className="mt-4">{children(activeTab)}</div>
    </div>
  );
};

export default Tabs;
