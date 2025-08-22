const ProfileHeader = () => {
  return (
    <div className="flex flex-col items-center py-8 px-4">
      <div
        className="w-32 h-32 rounded-full bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDFFZg5UKUHawx-FhhY0_rWg3iaMkRUWAKxq-Zs3_7MK7WAMkMW9u1tPQKDq7pb19OGlstwe_umC8Qi3TUoxedB5pYwf5s7tsrl1xheAgAFo0riwnmoYDLBwW2PpzUSIqpXB7_XRNlvQVY1t3Xi8PqgzKDaQ8Q9T9cQI8d-wV4Fe1Yi67kZXFILlRBIflgO6TYfY9DCHOdS6zHrQIVe_xRrlw0eJZfEcqaP_4UkVnyB5YBz_7ynSn1k8UBsFqum4T3Op66CJ731j4Fg')",
        }}
      ></div>
      <h2 className="text-2xl font-bold mt-4">Sophia Bennett</h2>
      <p className="text-[#9caaba]">@sophia_b</p>
      <p className="text-[#9caaba] text-center max-w-[400px]">
        Software Engineer | Coffee Lover | Travel Enthusiast
      </p>
      <button className="mt-4 bg-[#283039] px-6 py-2 rounded-lg font-bold">
        Edit Profile
      </button>
    </div>
  );
};

export default ProfileHeader;
