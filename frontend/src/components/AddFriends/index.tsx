import { X } from "lucide-react";
import { useState } from "react";
import { FormComponent } from "../FormInput";
import ShowAvatar from "../ShowAvatar";
import { Button } from "../ui/button";
import type { IFriendItemProps } from "../ChatPage/FriendList";

interface CreateGroupProps {
  friends: IFriendItemProps[];
  onCancel: () => void;
  onCreate: (groupName: string, members: IFriendItemProps[]) => void;
}

export const CreateGroupBody: React.FC<CreateGroupProps> = ({
  friends,
  onCancel,
  onCreate,
}) => {
  const [groupName, setGroupName] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [members, setMembers] = useState<IFriendItemProps[]>([]);

  const filteredFriends = friends.filter(
    (f) =>
      f.fullname.toLowerCase().includes(search.toLowerCase()) &&
      !members.find((m) => m.id === f.id)
  );

  const addMember = (friend: IFriendItemProps) => {
    setMembers((prev) => [...prev, friend]);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="space-y-5">
        <h2 className="text-lg font-semibold text-gray-200">Create Group</h2>
      {/* Group Name */}
      <FormComponent
        value={groupName}
        type="text"
        label="Group Name"
        required
        onChange={(e) => setGroupName(e.target.value)}
      />

      {/* Search */}
      <FormComponent
        value={search}
        type="search"
        label="Search Friends"
        placeholder="Search..."
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Search Results */}
      {search && (
        <div className="mt-2 max-h-40 overflow-y-auto rounded-md border border-gray-700 bg-gray-900 shadow-lg">
          {filteredFriends.length > 0 ? (
            filteredFriends.map((f) => (
              <div
                key={f.id}
                onClick={() => addMember(f)}
                className="flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-700"
              >
                <ShowAvatar avatar={f.avatar} fullname={f.fullname} />
                <span className="text-sm text-white">{f.fullname}</span>
              </div>
            ))
          ) : (
            <p className="px-3 py-2 text-sm text-gray-400">No friends found</p>
          )}
        </div>
      )}
      {/* Members */}
      <div className="flex flex-col gap-3 mt-4">
        <p className="text-sm font-medium text-gray-200 mb-1">Members</p>
        {members.length > 0 ? (
          <div>
            <div className="flex flex-wrap gap-3">
              {members.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full"
                >
                  <ShowAvatar avatar={m.avatar} fullname={m.fullname} />
                  <span className="text-sm text-white">{m.fullname}</span>
                  <X
                    className="h-4 w-4 text-gray-400 cursor-pointer hover:text-red-500"
                    onClick={() => removeMember(m.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-400">
            No members added
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          disabled={!groupName || members.length === 0}
          onClick={() => onCreate(groupName, members)}
        >
          Create Group
        </Button>
      </div>
    </div>
  );
};
