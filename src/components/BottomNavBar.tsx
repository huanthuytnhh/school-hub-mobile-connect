
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, MessageCircle, Bell, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link 
      to={to}
      className={cn(
        "bottom-nav-item", 
        isActive 
          ? "text-school-primary bg-green-100" 
          : "text-gray-500 hover:bg-gray-100"
      )}
    >
      {icon}
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
};

const BottomNavBar: React.FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 py-1">
      <div className="grid grid-cols-4 h-16">
        <NavItem 
          to="/"
          icon={<Home strokeWidth={1.5} size={20} />}
          label="Home"
          isActive={currentPath === '/'}
        />
        <NavItem 
          to="/announcements"
          icon={<MessageCircle strokeWidth={1.5} size={20} />}
          label="Messages"
          isActive={currentPath === '/announcements'}
        />
        <NavItem 
          to="/notifications"
          icon={<Bell strokeWidth={1.5} size={20} />}
          label="Alerts"
          isActive={currentPath === '/notifications'}
        />
        <NavItem 
          to="/profile"
          icon={<User strokeWidth={1.5} size={20} />}
          label="Profile"
          isActive={currentPath === '/profile'}
        />
      </div>
    </div>
  );
};

export default BottomNavBar;
