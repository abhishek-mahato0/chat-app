import { Heart } from "lucide-react";
import React from "react";

interface ICardProps {
    image: string;
    title: string;
    author: string;
    content: string;
}

export const Card = ({ image, title, author, content }: ICardProps) => {
  return (
    <div className="bg-[#1b2127] rounded-lg overflow-hidden shadow-md mb-6">
      <div
        className="w-full aspect-video bg-cover bg-center"
        style={{ backgroundImage: `url(${image})` }}
      />
      <div className="p-4">
        <h2 className="text-white text-lg font-bold mb-2">{title}</h2>
        <p className="text-[#9caaba] text-sm mb-2">{author}</p>
        <p className="text-[#9caaba] text-sm">{content}</p>
        <div className="flex gap-2 items-center mt-3">
            <Heart className="w-5 h-5 text-[#9caaba]" />
            <span className="text-white">0</span>
        </div>
      </div>
    </div>
  );
};
