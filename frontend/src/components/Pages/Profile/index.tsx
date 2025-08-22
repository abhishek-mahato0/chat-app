import FriendCard from "../../FriendCard";
import PostCard from "../../PostCard";
import ProfileHeader from "../../ProfileHeader";
import Tabs from "../../ProfileTabs";
import NavWrapper from "../../Wrappers/NavWrapper";

const postsData = [
  {
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD3IIO3CAqZrd2GcZap2mWHQIFL8AO5G4MSCg2I2y0AZAwMUkJiqYfrs6Lxqh61Xtr9uBtyuyT4aB4pri5nB5VuUJ4rSUVF9E6S4KpJR88gKeUgSv1fpCre84Xst8vO_6TiL8K_OGtGe_VjkbHnUn1D1Wd4daRnLQaiRD0g8umy7iySAYkVkyf-FPYPUHP_ijZSBa5QSVjtYyrA7xU7lVhzfExwymLUGaMlo8uOn42CEry9ciAR0yh2thg1HibUmugAZKCBzELzKA7Q",
    name: "Sophia Bennett",
    time: "2 hours ago",
    content:
      "Just finished reading 'The Midnight Library' by Matt Haig. Highly recommend it!",
    likes: 23,
    comments: 5,
    shares: 2,
  },
];

const friendsData = [
  {
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
    name: "Emily Johnson",
    username: "@emily_j",
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    name: "Michael Smith",
    username: "@michael_s",
  },
];

const ProfilePage = () => {
  return (
    <NavWrapper>
      <div className="min-h-screen bg-[#111418]">
        <ProfileHeader />
        <Tabs>
          {(activeTab) =>
            activeTab === "posts"
              ? postsData.map((post, index) => (
                  <PostCard key={index} {...post} />
                ))
              : friendsData.map((friend, index) => (
                  <FriendCard key={index} {...friend} />
                ))
          }
        </Tabs>
      </div>
    </NavWrapper>
  );
};

export default ProfilePage;
