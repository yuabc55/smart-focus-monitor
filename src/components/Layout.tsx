import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Timer, LayoutGrid, History, Settings } from 'lucide-react';
import clsx from 'clsx';

const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Timer className="w-6 h-6" />
            Smart Focus
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4 md:p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Bottom Navigation (Mobile) / Sidebar (Desktop - simulated here as bottom for simplicity or top) */}
      {/* Let's stick to a simple responsive nav bar at the bottom for mobile and maybe integrate into header for desktop later, 
          but for now bottom nav is very app-like and easy to access. */}
      
      <nav className="bg-white border-t border-gray-200 sticky bottom-0 z-10 pb-safe">
        <div className="container mx-auto max-w-4xl flex justify-around items-center">
          <NavItem to="/" icon={<Timer size={24} />} label="Focus" />
          <NavItem to="/mode" icon={<LayoutGrid size={24} />} label="Mode" />
          <NavItem to="/history" icon={<History size={24} />} label="History" />
          <NavItem to="/settings" icon={<Settings size={24} />} label="Settings" />
        </div>
      </nav>
    </div>
  );
};

const NavItem: React.FC<{ to: string; icon: React.ReactNode; label: string }> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        clsx(
          "flex flex-col items-center justify-center py-3 px-4 w-full transition-colors",
          isActive ? "text-blue-600 bg-blue-50" : "text-gray-500 hover:text-blue-500 hover:bg-gray-50"
        )
      }
    >
      {icon}
      <span className="text-xs mt-1 font-medium">{label}</span>
    </NavLink>
  );
};

export default Layout;
