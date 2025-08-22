import { Image } from "lucide-react";

export const Textarea = () => {
  return (
    <div className="flex flex-col border border-[#3b4754] bg-[#1b2127] rounded-lg overflow-hidden p-3 mb-7">
      <div className="flex w-full">
        <div className="flex p-2">
          <div
            className="bg-cover bg-center rounded-full w-10 h-10"
            style={{ backgroundImage: "url('./image.jpg')" }}
          ></div>
        </div>
        <textarea
          placeholder="What's on your mind?"
          className="flex-1 bg-[#1b2127] text-white p-3 mt-1 resize-none focus:outline-none focus:ring-0 placeholder:text-[#546578]"
          rows={4}
        />
      </div>
      <div className="flex justify-end mt-2 gap-3 items-center">
        <Image className=" w-6 h-6 cursor-pointer text-white"/>
        <button className="bg-[#0b78f4] text-white px-4 py-2 rounded-lg font-medium">
          Post
        </button>
      </div>
    </div>
  );
};
