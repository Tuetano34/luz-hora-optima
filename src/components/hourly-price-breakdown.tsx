
import { DailyPrices, getPriceLevel } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface HourlyPriceBreakdownProps {
  prices: DailyPrices;
  currentHour?: number;
}

export function HourlyPriceBreakdown({ prices, currentHour }: HourlyPriceBreakdownProps) {
  if (!prices || !prices.prices.length) {
    return null;
  }

  // Sort prices by hour
  const sortedPrices = [...prices.prices].sort((a, b) => a.hour - b.hour);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Desglose de precios por hora
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-auto max-h-[420px] px-2 py-1 md:px-6">
        <div className="grid grid-cols-1 gap-2">
          {sortedPrices.map((hourData) => {
            const priceLevel = getPriceLevel(
              hourData.price,
              prices.cheapestHour.price,
              prices.expensiveHour.price
            );
            
            const isCurrentHour = hourData.hour === currentHour;
            
            return (
              <div 
                key={hourData.hour} 
                className={`flex items-center justify-between p-3 rounded-md ${
                  isCurrentHour 
                    ? "bg-primary/10 border border-primary/20" 
                    : "bg-card hover:bg-secondary/20 transition-colors"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className={`text-energy-${priceLevel} font-medium text-xl w-14`}>
                    {hourData.hour < 10 ? `0${hourData.hour}` : hourData.hour}:00
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {hourData.hour === currentHour && (
                      <span className="text-primary font-medium mr-1">Ahora</span>
                    )}
                    {priceLevel === 'cheap' 
                      ? 'Precio bajo' 
                      : priceLevel === 'medium' 
                        ? 'Precio medio' 
                        : 'Precio alto'}
                  </div>
                </div>
                <div className={`text-energy-${priceLevel} font-bold`}>
                  {hourData.price.toFixed(5)} €/kWh
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
