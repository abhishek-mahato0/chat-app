interface IPostCardProps {
    avatar: string;
    name: string;
    time: string;
    content: string;
    likes: number;
    comments: number;
    shares: number;
}

const PostCard = ({ avatar, name, time, content, likes, comments, shares }: IPostCardProps) => {
  return (
    <div className="flex gap-4 bg-[#111418] px-4 py-3 rounded-lg mb-4">
      <div
        className="w-16 h-16 rounded-full bg-cover"
        style={{ backgroundImage: `url(${avatar})` }}
      ></div>
      <div className="flex-1">
        <p className="font-medium text-white">{name}</p>
        <p className="text-[#9caaba] text-sm">{time}</p>
        <p className="text-[#9caaba] text-sm">{content}</p>
        <div className="flex gap-4 mt-2 text-[#9caaba] text-sm">
          <span>❤️ {likes}</span>
          <span>💬 {comments}</span>
          <span>✈️ {shares}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
