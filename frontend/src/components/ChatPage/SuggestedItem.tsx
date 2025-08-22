
export interface ISuggestedItemProps {
  avatar: string;
  name: string;
  id: string;
}

const SuggestedItem = ({ avatar, name }: ISuggestedItemProps) => {
  return (
    <div className="flex items-center gap-4 bg-[#111418] px-4 py-2 rounded-lg cursor-pointer hover:bg-[#1c1f26]">
      <div
        className="w-14 h-14 rounded-full bg-center bg-cover"
        style={{ backgroundImage: `url(${avatar})` }}
      ></div>
      <p className="text-white font-medium">{name}</p>
    </div>
  );
};

export default SuggestedItem;
