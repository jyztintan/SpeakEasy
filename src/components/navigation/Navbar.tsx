"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Camera, Home, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  const menuItems = [
    { name: "Home", icon: <Home size={14} /> },
    { name: "Products", icon: <ShoppingCart size={14} /> },
    { name: "Notifications", icon: <Bell size={14} /> },
  ];

  const DesktopNav = () => (
    <nav className="hidden md:flex items-center justify-between bg-background p-4 border-b">
      <div className="flex items-center space-x-4">
        <a href="/" className="text-2xl font-bold">
          Logo
        </a>
        {menuItems.map((item) => (
          <a
            key={item.name}
            href={`/${item.name.toLowerCase()}`}
            className="text-foreground hover:text-primary"
          >
            {item.name}
          </a>
        ))}
      </div>
      <div className="flex items-center space-x-4">
        <Button className="flex items-center">
          <Camera size={16} className="mr-2" />
          Snap Photo
        </Button>
        <ProfileDropdown />
      </div>
    </nav>
  );

  const MobileNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 bg-background p-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] md:hidden">
      <div className="flex items-center justify-between">
        <div className="flex justify-around flex-1">
          {menuItems.slice(0, 2).map((item) => (
            <a
              key={item.name}
              href={`/${item.name.toLowerCase()}`}
              className="flex flex-col items-center space-y-1 text-foreground hover:text-primary"
            >
              {item.icon}
              <span className="text-xs">{item.name}</span>
            </a>
          ))}
          <a
            href="/"
            className="flex flex-col items-center space-y-1 text-foreground hover:text-primary"
          >
            <Camera size={14} />
            <span className="text-xs">Snap Photo</span>
          </a>
          <a
            href={`/${menuItems[2].name.toLowerCase()}`}
            className="flex flex-col items-center space-y-1 text-foreground hover:text-primary"
          >
            {menuItems[2].icon}
            <span className="text-xs">{menuItems[2].name}</span>
          </a>
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );

  const ProfileDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div>
          <div className="md:hidden flex flex-col items-center space-y-1 text-foreground hover:text-primary">
            <User size={14} />
            <span className="text-xs">Profile</span>
          </div>
          <button className="hidden md:flex">
            <User size={16} />
          </button>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
      <DesktopNav />
      <MobileNav />
    </>
  );
}
