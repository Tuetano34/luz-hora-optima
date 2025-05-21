
import { DailyPrices, getPriceLevel } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface BestHoursCardProps {
  prices: DailyPrices;
  title: string;
}

export function BestHoursCard({ prices, title }: BestHoursCardProps) {
  if (!prices || !prices.prices.length) {
    return null;
  }
  
  // Sort prices to find best 3 hours
  const bestHours = [...prices.prices]
    .sort((a, b) => a.price - b.price)
    .slice(0, 3);
    
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {bestHours.map((hour) => {
            const priceLevel = getPriceLevel(
              hour.price,
              prices.cheapestHour.price,
              prices.expensiveHour.price
            );
            
            return (
              <li key={hour.hour} className="flex items-center justify-between">
                <span className="font-medium">
                  {hour.hour}:00 - {hour.hour + 1 < 24 ? hour.hour + 1 : 0}:00
                </span>
                <span className={`font-semibold text-energy-${priceLevel}`}>
                  {hour.price.toFixed(5)} €/kWh
                </span>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
