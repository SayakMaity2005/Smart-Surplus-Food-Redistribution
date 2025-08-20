export interface User {
  id: string;
  email: string;
  name: string;
  role: 'provider' | 'buyer';
  organization?: string;
  phone?: string;
  createdAt: Date;
}

export interface FoodItem {
  id: string;
  title: string;
  description: string;
  type: 'vegetarian' | 'non-vegetarian' | 'vegan' | 'contains-dairy' | 'gluten-free';
  quantity: number;
  unit: 'servings' | 'kg' | 'pieces';
  location: string;
  providerId: string;
  providerName: string;
  freshness: 'excellent' | 'good' | 'fair';
  safeToEatHours: number;
  expiresAt: Date;
  createdAt: Date;
  status: 'available' | 'reserved' | 'picked-up' | 'expired';
  pickupWindow: {
    start: string;
    end: string;
  };
  images?: string[];
  specialInstructions?: string;
  reservedBy?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'new-food' | 'pickup-reminder' | 'expiry-warning' | 'reservation-confirmed';
  title: string;
  message: string;
  foodItemId?: string;
  read: boolean;
  createdAt: Date;
}

export interface AnalyticsData {
  totalFoodSaved: number;
  totalServings: number;
  carbonFootprintSaved: number;
  waterFootprintSaved: number;
  peopleServed: number;
  activeProviders: number;
  activeBuyers: number;
  monthlyTrend: Array<{
    month: string;
    foodSaved: number;
    co2Saved: number;
  }>;
}

export interface Event {
  id: string;
  name: string;
  date: Date;
  location: string;
  organizerId: string;
  expectedAttendees: number;
  foodLogged: boolean;
  reminderSent: boolean;
}