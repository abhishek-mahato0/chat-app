import { useState } from "react";
import {
  Menu,
  X,
  Search,
  Bell,
  MessageCircle,
  HomeIcon,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Link } from "react-router-dom";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    {
      id: 1,
      name: "Home",
      icon: <HomeIcon className="w-6 h-6 cursor-pointer" />,
      link: "/",
    },
    {
      id: 2,
      name: "Explore",
      icon: <Users className="w-6 h-6 cursor-pointer" />,
      link: "/explore",
    },
    {
      id: 3,
      name: "Notifications",
      icon: <Bell className="w-6 h-6 cursor-pointer" />,
      link: "/notifications",
    },
    {
      id: 4,
      name: "Messages",
      icon: <MessageCircle className="w-6 h-6 cursor-pointer" />,
      link: "/chat",
    },
  ];

  return (
    <header className="bg-[#111418] border-b border-[#283039] px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="text-white w-8 h-8">
          <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" fill="currentColor" />
          </svg>
        </div>
        <h2 className="text-white text-lg font-bold">ConnectHub</h2>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="hidden w-[260px] md:flex items-center bg-[#283039] rounded-lg px-3 py-1 text-[#9caaba]">
          <Search className="w-5 h-5 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent placeholder:text-[#9caaba] focus:outline-none text-white text-sm p-1"
          />
        </div>

        {/* Icons */}
        <div className="hidden md:flex items-center gap-5 text-white">
          {links.map((link) => (
            <Tooltip>
              <TooltipTrigger>
                <Link
                  key={link.id}
                  to={link.link}
                  className="flex items-center gap-2"
                >
                  {link.icon}
                </Link>
              </TooltipTrigger>
              <TooltipContent>{link.name}</TooltipContent>
            </Tooltip>
          ))}
          <Avatar>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-[#111418] border-t border-[#283039] flex flex-col md:hidden py-2">
          <a href="#" className="px-4 py-2 text-white text-sm font-medium">
            Home
          </a>
          <a href="#" className="px-4 py-2 text-white text-sm font-medium">
            Explore
          </a>
          <a href="#" className="px-4 py-2 text-white text-sm font-medium">
            Notifications
          </a>
          <a href="#" className="px-4 py-2 text-white text-sm font-medium">
            Messages
          </a>
        </div>
      )}
    </header>
  );
};
