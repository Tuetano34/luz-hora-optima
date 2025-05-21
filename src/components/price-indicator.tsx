
import { DailyPrices, getPriceLevel } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";

interface PriceIndicatorProps {
  prices: DailyPrices;
  currentHour: number;
}

export function PriceIndicator({ prices, currentHour }: PriceIndicatorProps) {
  if (!prices || !prices.prices.length) {
    return null;
  }

  const currentPrice = prices.prices.find(p => p.hour === currentHour);
  
  if (!currentPrice) return null;

  const priceLevel = getPriceLevel(
    currentPrice.price,
    prices.cheapestHour.price,
    prices.expensiveHour.price
  );

  const levelStyles = {
    cheap: "text-energy-cheap animate-pulse-slow",
    medium: "text-energy-medium",
    expensive: "text-energy-expensive animate-pulse-slow",
  };

  return (
    <Card className="bg-opacity-50 backdrop-blur-sm">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-medium uppercase mb-1">Precio actual</h3>
          <div className={`text-3xl font-bold ${levelStyles[priceLevel]}`}>
            {currentPrice.price.toFixed(5)} €/kWh
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {currentHour}:00 - {currentHour + 1 < 24 ? currentHour + 1 : 0}:00
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
