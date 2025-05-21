
import { useState, useEffect } from 'react';
import { DailyPrices, getTodayPrices, getTomorrowPrices } from '@/lib/api';

export function usePrices() {
  const [todayPrices, setTodayPrices] = useState<DailyPrices | null>(null);
  const [tomorrowPrices, setTomorrowPrices] = useState<DailyPrices | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentHour, setCurrentHour] = useState<number>(new Date().getHours());

  const refreshPrices = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch today's prices
      const today = await getTodayPrices();
      setTodayPrices(today);
      
      // Try to fetch tomorrow's prices (may be null if not available yet)
      const tomorrow = await getTomorrowPrices();
      setTomorrowPrices(tomorrow);
    } catch (err) {
      console.error("Failed to fetch prices:", err);
      setError("No se pudieron cargar los precios. Por favor, inténtelo de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
  };

  // Update the current hour every minute
  useEffect(() => {
    const intervalId = setInterval(() => {
      const now = new Date();
      setCurrentHour(now.getHours());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  // Fetch prices on component mount
  useEffect(() => {
    refreshPrices();
    
    // Refresh prices every hour
    const intervalId = setInterval(refreshPrices, 3600000);
    
    return () => clearInterval(intervalId);
  }, []);

  return {
    todayPrices,
    tomorrowPrices,
    currentHour,
    loading,
    error,
    refreshPrices,
  };
}
