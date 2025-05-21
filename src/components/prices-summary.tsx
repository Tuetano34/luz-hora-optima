
import { DailyPrices } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PricesSummaryProps {
  prices: DailyPrices;
}

export function PricesSummary({ prices }: PricesSummaryProps) {
  if (!prices) return null;
  
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Resumen del día</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="space-y-2">
          <div className="flex justify-between">
            <dt className="font-medium">Precio medio:</dt>
            <dd className="font-semibold">{prices.averagePrice.toFixed(5)} €/kWh</dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">Precio más bajo:</dt>
            <dd className="font-semibold text-energy-cheap">
              {prices.cheapestHour.price.toFixed(5)} €/kWh
              <span className="text-xs text-muted-foreground ml-1">
                ({prices.cheapestHour.hour}:00)
              </span>
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="font-medium">Precio más alto:</dt>
            <dd className="font-semibold text-energy-expensive">
              {prices.expensiveHour.price.toFixed(5)} €/kWh
              <span className="text-xs text-muted-foreground ml-1">
                ({prices.expensiveHour.hour}:00)
              </span>
            </dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
}
