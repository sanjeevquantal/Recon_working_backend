
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, FileText } from "lucide-react";

type SidebarItemProps = {
  to: string;
  icon: React.ReactNode;
  text: string;
  current?: boolean;
};

const SidebarItem = ({ to, icon, text, current }: SidebarItemProps) => {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => 
        `flex items-center px-4 py-3 text-sm font-medium rounded-md ${
          isActive ? "bg-primary text-white" : "text-gray-300 hover:text-white hover:bg-gray-700"
        }`
      }
    >
      <div className="mr-3">{icon}</div>
      <span>{text}</span>
    </NavLink>
  );
};

const CustomSidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-[#221F26] text-white">
      <div className="p-4 flex flex-col items-center">
        <img 
          src="/lovable-uploads/015c83e1-bfd4-4a01-94a0-b408716118ce.png" 
          alt="Recon Logo" 
          className="h-10 mb-2" 
        />
        <h2 className="text-lg font-semibold">ACME Finance</h2>
      </div>
      
      <nav className="mt-8 flex-1 px-2 space-y-2">
        <SidebarItem 
          to="/dashboard" 
          icon={<LayoutDashboard size={20} />} 
          text="Dashboard" 
        />
        <SidebarItem 
          to="/users" 
          icon={<Users size={20} />} 
          text="Users" 
        />
        <SidebarItem 
          to="/settings" 
          icon={<Settings size={20} />} 
          text="Recon Settings" 
        />
        <SidebarItem 
          to="/reporting" 
          icon={<FileText size={20} />} 
          text="Reporting Settings" 
        />
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <img
              className="h-10 w-10 rounded-full"
              src="https://via.placeholder.com/40"
              alt="User"
            />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-400">john@example.com</p>
          </div>
        </div>
        <button
          className="mt-4 w-full flex items-center px-4 py-2 text-sm text-white hover:bg-gray-700 rounded-md"
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default CustomSidebar;
