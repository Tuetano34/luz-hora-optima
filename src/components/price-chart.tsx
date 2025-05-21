
import { DailyPrices, HourlyPrice, getPriceLevel } from "@/lib/api";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface PriceChartProps {
  prices: DailyPrices;
  currentHour?: number;
}

export function PriceChart({ prices, currentHour }: PriceChartProps) {
  if (!prices || !prices.prices.length) {
    return <div>No hay datos disponibles</div>;
  }

  // Format data for the chart
  const chartData = prices.prices.map((hourData) => ({
    hour: `${hourData.hour}:00`,
    price: hourData.price,
    formattedPrice: `${hourData.price.toFixed(5)} €/kWh`,
    level: getPriceLevel(
      hourData.price,
      prices.cheapestHour.price,
      prices.expensiveHour.price
    ),
  }));

  // Color mapping for price levels
  const levelColors = {
    cheap: "#4ade80",
    medium: "#facc15",
    expensive: "#f87171",
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle>Precios por hora</CardTitle>
      </CardHeader>
      <CardContent className="p-1 md:p-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{
                top: 10,
                right: 0,
                left: 0,
                bottom: 0,
              }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis 
                dataKey="hour" 
                fontSize={12}
                tickFormatter={(hour) => hour.split(':')[0]}
              />
              <YAxis
                fontSize={12}
                tickFormatter={(value) => `${value.toFixed(2)}`}
                domain={['dataMin - 0.02', 'dataMax + 0.02']}
              />
              <Tooltip
                formatter={(value: number) => [`${value.toFixed(5)} €/kWh`, "Precio"]}
                labelFormatter={(hour) => `Hora: ${hour}`}
                contentStyle={{
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  border: "none",
                  borderRadius: "4px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="#0ea5e9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorPrice)"
              />
              {currentHour !== undefined && (
                <ReferenceLine
                  x={`${currentHour}:00`}
                  stroke="#ffffff"
                  strokeDasharray="3 3"
                  strokeWidth={2}
                  label={{ 
                    value: "Ahora",
                    position: "insideTopRight",
                    fill: "#ffffff",
                    fontSize: 12
                  }}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center items-center gap-6 mt-4">
          <div className="flex items-center text-xs">
            <span className="block w-3 h-3 rounded-full bg-energy-cheap mr-1"></span>
            <span>Barato</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="block w-3 h-3 rounded-full bg-energy-medium mr-1"></span>
            <span>Medio</span>
          </div>
          <div className="flex items-center text-xs">
            <span className="block w-3 h-3 rounded-full bg-energy-expensive mr-1"></span>
            <span>Caro</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
