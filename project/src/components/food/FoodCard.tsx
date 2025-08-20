import React from 'react';
import { Clock, MapPin, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { FoodItem } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

interface FoodCardProps {
  item: FoodItem;
  onReserve?: (id: string) => void;
  showActions?: boolean;
}

export const FoodCard: React.FC<FoodCardProps> = ({ 
  item, 
  onReserve, 
  showActions = true 
}) => {
  const { user } = useAuth();
  const isExpiringSoon = new Date(item.expiresAt).getTime() - Date.now() < 2 * 60 * 60 * 1000; // 2 hours
  
  const getFreshnessColor = (freshness: string) => {
    switch (freshness) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'fair': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vegetarian': return 'text-green-600 bg-green-50';
      case 'vegan': return 'text-emerald-600 bg-emerald-50';
      case 'non-vegetarian': return 'text-red-600 bg-red-50';
      case 'gluten-free': return 'text-purple-600 bg-purple-50';
      case 'contains-dairy': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-600 bg-green-50 border-green-200';
      case 'reserved': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'picked-up': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'expired': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card hover className="h-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            {isExpiringSoon && (
              <AlertCircle className="w-5 h-5 text-orange-500 ml-2 flex-shrink-0" />
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(item.type)}`}>
              {item.type.replace('-', ' ')}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getFreshnessColor(item.freshness)}`}>
              {item.freshness} quality
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
              {item.status}
            </span>
          </div>

          {/* Quantity and Details */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center space-x-1 text-gray-500 mb-1">
                <Users className="w-4 h-4" />
                <span>Quantity</span>
              </div>
              <div className="font-medium text-gray-900">
                {item.quantity} {item.unit}
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1 text-gray-500 mb-1">
                <Clock className="w-4 h-4" />
                <span>Safe for</span>
              </div>
              <div className="font-medium text-gray-900">
                {item.safeToEatHours}h
              </div>
            </div>
          </div>

          {/* Location and Pickup Time */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-sm">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">{item.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">
                Pickup: {item.pickupWindow.start} - {item.pickupWindow.end}
              </span>
            </div>
          </div>

          {/* Provider Info */}
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">{item.providerName}</div>
                <div className="text-xs text-gray-500">Provider</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  Expires in {Math.ceil((new Date(item.expiresAt).getTime() - Date.now()) / (1000 * 60 * 60))}h
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(item.expiresAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>

          {/* Special Instructions */}
          {item.specialInstructions && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="text-sm font-medium text-blue-900 mb-1">Special Instructions</div>
                  <div className="text-sm text-blue-700">{item.specialInstructions}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {showActions && user?.role === 'buyer' && item.status === 'available' && (
            <div className="flex gap-2 pt-2">
              <Button
                onClick={() => onReserve?.(item.id)}
                className="flex-1"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Reserve Item
              </Button>
            </div>
          )}

          {item.status === 'reserved' && item.reservedBy === user?.id && (
            <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-900">
                  Reserved by you - Please pickup during the specified window
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};