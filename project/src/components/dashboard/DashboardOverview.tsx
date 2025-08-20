import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Package, 
  Leaf,
  Clock,
  MapPin
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useAuth } from '../../context/AuthContext';
import { useFoodItems } from '../../hooks/useFoodItems';
import { useAnalytics } from '../../hooks/useAnalytics';

export const DashboardOverview: React.FC = () => {
  const { user } = useAuth();
  const { foodItems, getAvailableFoodItems } = useFoodItems();
  const { analytics } = useAnalytics();

  const availableItems = getAvailableFoodItems();
  const myItems = user?.role === 'provider' ? foodItems.filter(item => item.providerId === user.id) : [];

  const providerStats = [
    {
      title: 'Active Listings',
      value: myItems.filter(item => item.status === 'available').length,
      icon: Package,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Total Items Posted',
      value: myItems.length,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'People Served',
      value: myItems.filter(item => item.status === 'picked-up').length * 3,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'CO2 Saved (kg)',
      value: `${(myItems.length * 2.3).toFixed(1)}`,
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const buyerStats = [
    {
      title: 'Available Items',
      value: availableItems.length,
      icon: Package,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      title: 'Items Reserved',
      value: foodItems.filter(item => item.reservedBy === user?.id).length,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Active Providers',
      value: analytics.activeProviders,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Your Impact (kg CO2)',
      value: `${(foodItems.filter(item => item.reservedBy === user?.id).length * 1.5).toFixed(1)}`,
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
  ];

  const stats = user?.role === 'provider' ? providerStats : buyerStats;

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-xl text-white p-6">
        <h2 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}!
        </h2>
        <p className="text-emerald-100">
          {user?.role === 'provider' 
            ? 'Help reduce food waste by sharing surplus food with the community.'
            : 'Discover available surplus food and make a positive environmental impact.'
          }
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Items */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">
              {user?.role === 'provider' ? 'Recent Listings' : 'Available Near You'}
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {(user?.role === 'provider' ? myItems : availableItems)
              .slice(0, 3)
              .map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`p-2 rounded-full ${
                    item.type === 'vegetarian' ? 'bg-green-100 text-green-600' : 
                    item.type === 'vegan' ? 'bg-emerald-100 text-emerald-600' :
                    'bg-orange-100 text-orange-600'
                  }`}>
                    <Package className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{item.pickupWindow.start} - {item.pickupWindow.end}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{item.quantity}</div>
                    <div className="text-sm text-gray-500">{item.unit}</div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Impact Summary */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Environmental Impact</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Leaf className="w-5 h-5 text-green-600" />
                <h4 className="font-medium text-green-900">Your Contribution</h4>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-2xl font-bold text-green-800">
                    {user?.role === 'provider' 
                      ? `${(myItems.length * 0.8).toFixed(1)}kg`
                      : `${(foodItems.filter(item => item.reservedBy === user?.id).length * 0.6).toFixed(1)}kg`
                    }
                  </div>
                  <div className="text-sm text-green-600">Food Saved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-800">
                    {user?.role === 'provider' 
                      ? myItems.filter(item => item.status === 'picked-up').length * 3
                      : foodItems.filter(item => item.reservedBy === user?.id).length * 2
                    }
                  </div>
                  <div className="text-sm text-green-600">People Impacted</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};