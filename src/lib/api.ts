
/**
 * API utilities for fetching electricity price data from ESIOS API
 */

// The ESIOS API requires a token for access, but since we don't have one in this demo,
// we'll use mock data that follows the same structure
export interface HourlyPrice {
  hour: number;
  price: number;
  date: string;
}

export interface DailyPrices {
  date: string;
  prices: HourlyPrice[];
  averagePrice: number;
  cheapestHour: HourlyPrice;
  expensiveHour: HourlyPrice;
}

// Function to get the current day's prices
export async function getTodayPrices(): Promise<DailyPrices> {
  // In a real implementation, we would fetch data from the ESIOS API
  // For now, we'll generate mock data
  
  try {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // In a real app, we would make a fetch request to the ESIOS API
    // Example:
    // const response = await fetch('https://api.esios.ree.es/indicators/1001', {
    //   headers: {
    //     'Accept': 'application/json',
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Token token=<YOUR_API_TOKEN>'
    //   }
    // });
    // const data = await response.json();
    
    // Generate some mock data for demonstration
    const mockPrices: HourlyPrice[] = Array(24).fill(0).map((_, i) => {
      // Create a price pattern: cheaper at night, more expensive during the day
      let basePrice: number;
      
      if (i >= 0 && i < 7) {
        // Night hours (0-6) - cheaper
        basePrice = 0.08 + Math.random() * 0.04;
      } else if ((i >= 7 && i < 10) || (i >= 14 && i < 18)) {
        // Morning and afternoon - medium
        basePrice = 0.15 + Math.random() * 0.05;
      } else if (i >= 10 && i < 14) {
        // Midday - more expensive
        basePrice = 0.22 + Math.random() * 0.08;
      } else if (i >= 18 && i < 22) {
        // Evening - most expensive
        basePrice = 0.25 + Math.random() * 0.1;
      } else {
        // Late evening - medium
        basePrice = 0.15 + Math.random() * 0.05;
      }
      
      // Round to 5 decimal places
      const price = Math.round(basePrice * 100000) / 100000;
      
      return {
        hour: i,
        price,
        date: todayStr
      };
    });
    
    const prices = mockPrices.sort((a, b) => a.hour - b.hour);
    const averagePrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
    
    // Find cheapest and most expensive hours
    const cheapestHour = [...prices].sort((a, b) => a.price - b.price)[0];
    const expensiveHour = [...prices].sort((a, b) => b.price - a.price)[0];
    
    return {
      date: todayStr,
      prices,
      averagePrice,
      cheapestHour,
      expensiveHour
    };
  } catch (error) {
    console.error("Error fetching electricity prices:", error);
    throw new Error("Failed to fetch electricity prices");
  }
}

// Function to get the tomorrow's prices (if available, usually after 20:00)
export async function getTomorrowPrices(): Promise<DailyPrices | null> {
  const now = new Date();
  // In reality, tomorrow's prices are usually published after 20:00
  // Here we'll just return null if it's before 20:00, and mock data if after
  if (now.getHours() < 20) {
    return null;
  }
  
  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    
    // Similar mock data generation as getTodayPrices
    const mockPrices: HourlyPrice[] = Array(24).fill(0).map((_, i) => {
      let basePrice: number;
      
      if (i >= 0 && i < 7) {
        basePrice = 0.07 + Math.random() * 0.04;
      } else if ((i >= 7 && i < 10) || (i >= 14 && i < 18)) {
        basePrice = 0.14 + Math.random() * 0.05;
      } else if (i >= 10 && i < 14) {
        basePrice = 0.21 + Math.random() * 0.08;
      } else if (i >= 18 && i < 22) {
        basePrice = 0.24 + Math.random() * 0.1;
      } else {
        basePrice = 0.14 + Math.random() * 0.05;
      }
      
      const price = Math.round(basePrice * 100000) / 100000;
      
      return {
        hour: i,
        price,
        date: tomorrowStr
      };
    });
    
    const prices = mockPrices.sort((a, b) => a.hour - b.hour);
    const averagePrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
    const cheapestHour = [...prices].sort((a, b) => a.price - b.price)[0];
    const expensiveHour = [...prices].sort((a, b) => b.price - a.price)[0];
    
    return {
      date: tomorrowStr,
      prices,
      averagePrice,
      cheapestHour,
      expensiveHour
    };
  } catch (error) {
    console.error("Error fetching tomorrow's electricity prices:", error);
    return null;
  }
}

// Helper function to determine price level based on the price relative to the day's range
export function getPriceLevel(price: number, minPrice: number, maxPrice: number): 'cheap' | 'medium' | 'expensive' {
  const range = maxPrice - minPrice;
  const threshold1 = minPrice + range * 0.33;
  const threshold2 = minPrice + range * 0.66;
  
  if (price <= threshold1) return 'cheap';
  if (price <= threshold2) return 'medium';
  return 'expensive';
}
