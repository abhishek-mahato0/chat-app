import React from "react";
import NavWrapper from "../../Wrappers/NavWrapper";
import { Textarea } from "../../TextArea";
import { Card } from "../../Card";

const Dashboard = () => {
  const posts = [
    {
      image: "./image.jpg",
      title: "Exploring the Hidden Gems of the Pacific Northwest",
      author: "Sarah Thompson",
      content:
        "Just back from an incredible journey through the Pacific Northwest! From the misty forests to the rugged coastlines...",
    },
    {
      image: "./image.jpg",
      title: "The Art of Slow Living: Finding Joy in the Everyday",
      author: "Emily Carter",
      content:
        "In a world that constantly pushes us to do more, I've been exploring the beauty of slow living. It's about savoring the simple moments...",
    },
  ];
  return (
    <NavWrapper>
      <div className="bg-[#111418] min-h-screen p-10">
        <div className="max-w-3xl mx-auto flex flex-col">
          <Textarea />
          <div className="w-full">
            {posts.map((post, index) => (
              <Card key={index} {...post} />
            ))}
          </div>
        </div>
      </div>
    </NavWrapper>
  );
};

export default Dashboard;
