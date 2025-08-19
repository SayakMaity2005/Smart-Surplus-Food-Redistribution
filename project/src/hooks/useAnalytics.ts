import { useState, useEffect } from 'react';
import { AnalyticsData } from '../types';

export const useAnalytics = () => {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalFoodSaved: 2450,
    totalServings: 18750,
    carbonFootprintSaved: 1230,
    waterFootprintSaved: 45600,
    peopleServed: 8940,
    activeProviders: 24,
    activeBuyers: 186,
    monthlyTrend: [
      { month: 'Jan', foodSaved: 180, co2Saved: 95 },
      { month: 'Feb', foodSaved: 220, co2Saved: 115 },
      { month: 'Mar', foodSaved: 190, co2Saved: 98 },
      { month: 'Apr', foodSaved: 250, co2Saved: 135 },
      { month: 'May', foodSaved: 280, co2Saved: 145 },
      { month: 'Jun', foodSaved: 310, co2Saved: 165 },
    ],
  });
  
  const [loading, setLoading] = useState(false);

  const refreshAnalytics = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In a real app, this would fetch from your API
    setLoading(false);
  };

  return { analytics, loading, refreshAnalytics };
};