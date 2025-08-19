import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthPage } from './components/auth/AuthPage';
import { Header } from './components/dashboard/Header';
import { Sidebar } from './components/dashboard/Sidebar';
import { DashboardOverview } from './components/dashboard/DashboardOverview';
import { AddFoodForm } from './components/food/AddFoodForm';
import { FoodCard } from './components/food/FoodCard';
import { AnalyticsDashboard } from './components/analytics/AnalyticsDashboard';
import { useFoodItems } from './hooks/useFoodItems';

const BrowseFoodTab: React.FC = () => {
  const { getAvailableFoodItems, reserveFoodItem } = useFoodItems();
  const { user } = useAuth();
  const availableItems = getAvailableFoodItems();

  const handleReserve = async (id: string) => {
    if (user) {
      await reserveFoodItem(id, user.id);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Food Items</h2>
        <p className="text-gray-600">Browse and reserve surplus food from campus providers</p>
      </div>
      
      {availableItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              onReserve={handleReserve}
              showActions={true}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No food items available at the moment</p>
          <p className="text-gray-400">Check back later or contact providers directly</p>
        </div>
      )}
    </div>
  );
};

const MyItemsTab: React.FC = () => {
  const { getFoodItemsByProvider } = useFoodItems();
  const { user } = useAuth();
  const myItems = user ? getFoodItemsByProvider(user.id) : [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">My Food Items</h2>
        <p className="text-gray-600">Manage your posted food items and track their status</p>
      </div>
      
      {myItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              showActions={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">You haven't posted any food items yet</p>
          <p className="text-gray-400">Start by adding your first food item to help reduce waste</p>
        </div>
      )}
    </div>
  );
};

const ReservedItemsTab: React.FC = () => {
  const { foodItems } = useFoodItems();
  const { user } = useAuth();
  const reservedItems = foodItems.filter(item => item.reservedBy === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Reserved Items</h2>
        <p className="text-gray-600">Items you have reserved for pickup</p>
      </div>
      
      {reservedItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservedItems.map((item) => (
            <FoodCard
              key={item.id}
              item={item}
              showActions={false}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">No reserved items</p>
          <p className="text-gray-400">Browse available food to make reservations</p>
        </div>
      )}
    </div>
  );
};

const EventsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Campus Events</h2>
        <p className="text-gray-600">Manage events and food logging reminders</p>
      </div>
      
      <div className="bg-blue-50 rounded-lg p-8 text-center">
        <p className="text-blue-600 text-lg font-medium">Event Integration Coming Soon</p>
        <p className="text-blue-500 mt-2">Automatic event reminders and food logging will be available soon</p>
      </div>
    </div>
  );
};

const SettingsTab: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Manage your account and notification preferences</p>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-8 text-center">
        <p className="text-gray-600 text-lg font-medium">Settings Panel Coming Soon</p>
        <p className="text-gray-500 mt-2">Account settings and preferences will be available soon</p>
      </div>
    </div>
  );
};

const DashboardContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { user } = useAuth();

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'add-food':
        return <AddFoodForm />;
      case 'my-items':
        return <MyItemsTab />;
      case 'browse':
        return <BrowseFoodTab />;
      case 'reserved':
        return <ReservedItemsTab />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'events':
        return <EventsTab />;
      case 'settings':
        return <SettingsTab />;
      default:
        return <DashboardOverview />;
    }
  };

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <DashboardContent />
    </AuthProvider>
  );
}

export default App;