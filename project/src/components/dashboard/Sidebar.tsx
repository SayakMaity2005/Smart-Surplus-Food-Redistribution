import React from 'react';
import { 
  Home, 
  Package, 
  Plus, 
  BarChart3, 
  Calendar, 
  Settings,
  ShoppingCart,
  Clock
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user } = useAuth();

  const providerTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'add-food', label: 'Add Food Item', icon: Plus },
    { id: 'my-items', label: 'My Items', icon: Package },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const buyerTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'browse', label: 'Browse Food', icon: ShoppingCart },
    { id: 'reserved', label: 'Reserved Items', icon: Clock },
    { id: 'analytics', label: 'Impact', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const tabs = user?.role === 'provider' ? providerTabs : buyerTabs;

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen sticky top-0">
      <nav className="p-4 space-y-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};