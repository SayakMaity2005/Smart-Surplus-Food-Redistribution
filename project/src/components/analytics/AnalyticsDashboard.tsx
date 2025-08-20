import React from 'react';
import { TrendingUp, Users, Leaf, Droplets, Award } from 'lucide-react';
import { Card, CardContent, CardHeader } from '../ui/Card';
import { useAnalytics } from '../../hooks/useAnalytics';

export const AnalyticsDashboard: React.FC = () => {
  const { analytics, loading } = useAnalytics();

  const impactCards = [
    {
      title: 'Total Food Saved',
      value: `${analytics.totalFoodSaved}kg`,
      icon: Leaf,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      description: 'Prevented from going to waste',
    },
    {
      title: 'People Served',
      value: analytics.peopleServed.toLocaleString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      description: 'Community members helped',
    },
    {
      title: 'CO2 Footprint Saved',
      value: `${analytics.carbonFootprintSaved}kg`,
      icon: TrendingUp,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
      description: 'Carbon emissions prevented',
    },
    {
      title: 'Water Footprint Saved',
      value: `${analytics.waterFootprintSaved}L`,
      icon: Droplets,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
      description: 'Water resources conserved',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl text-white p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Award className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Environmental Impact Dashboard</h2>
        </div>
        <p className="text-emerald-100">
          Track the positive environmental impact of our food redistribution efforts
        </p>
      </div>

      {/* Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {impactCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <Card key={index} hover>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${card.bgColor}`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{card.value}</p>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Additional Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Monthly Food Saving Trend</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.monthlyTrend.map((month) => (
                <div key={month.month} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                      <span className="text-emerald-600 font-bold text-sm">{month.month}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{month.foodSaved}kg Food</div>
                      <div className="text-sm text-gray-500">{month.co2Saved}kg CO2 Saved</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="w-20 h-2 bg-gray-200 rounded-full">
                      <div 
                        className="h-2 bg-emerald-500 rounded-full"
                        style={{ width: `${(month.foodSaved / 350) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Community Stats */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold text-gray-900">Community Overview</h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{analytics.activeProviders}</div>
                <div className="text-sm text-blue-800">Active Providers</div>
              </div>
              <div className="text-center p-4 bg-emerald-50 rounded-lg">
                <div className="text-2xl font-bold text-emerald-600">{analytics.activeBuyers}</div>
                <div className="text-sm text-emerald-800">Active Buyers</div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-green-900">Waste Reduction Rate</div>
                    <div className="text-2xl font-bold text-green-800">87.3%</div>
                  </div>
                  <Leaf className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-blue-900">Community Engagement</div>
                    <div className="text-2xl font-bold text-blue-800">94.1%</div>
                  </div>
                  <Users className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </div>

            {/* Environmental Impact Summary */}
            <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-900 mb-2">This Month's Impact</h4>
              <div className="space-y-1 text-sm text-orange-800">
                <p>• Equivalent to planting 45 trees</p>
                <p>• Saved energy for 12 homes for a day</p>
                <p>• Reduced landfill waste by 2.1 tons</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};