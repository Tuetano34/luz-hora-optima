
import { useState } from "react";
import { usePrices } from "@/hooks/use-prices";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { PriceChart } from "@/components/price-chart";
import { PriceIndicator } from "@/components/price-indicator";
import { BestHoursCard } from "@/components/best-hours-card";
import { PricesSummary } from "@/components/prices-summary";
import { HourlyPriceBreakdown } from "@/components/hourly-price-breakdown";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, DatabaseZap, ArrowRight, CalendarClock } from "lucide-react";

const Index = () => {
  const { todayPrices, tomorrowPrices, currentHour, loading, error, refreshPrices } = usePrices();
  const [activeTab, setActiveTab] = useState("today");
  const [showHourlyBreakdown, setShowHourlyBreakdown] = useState(false);

  // Format today's date nicely
  const today = new Date();
  const todayFormatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(today);
  
  // Format tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = new Intl.DateTimeFormat('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  }).format(tomorrow);

  // Function for refreshing data
  const handleRefresh = () => {
    refreshPrices();
  };

  // Toggle hourly breakdown view
  const toggleHourlyBreakdown = () => {
    setShowHourlyBreakdown(prev => !prev);
  };

  return (
    <ThemeProvider defaultTheme="system">
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20 dark:from-background dark:to-secondary/5">
        <div className="container pt-4 pb-16 px-4 md:px-6">
          <header className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1 flex items-center">
                <DatabaseZap className="mr-2" />
                Precio de la Luz
              </h1>
              <p className="text-sm text-muted-foreground">
                Precios del mercado eléctrico en España
              </p>
            </div>
            <ThemeToggle />
          </header>

          {loading && !todayPrices && (
            <div className="flex items-center justify-center h-64">
              <div className="animate-pulse flex flex-col items-center">
                <div className="h-12 w-12 rounded-full bg-primary/20 mb-4"></div>
                <div className="h-4 w-48 bg-primary/20 rounded"></div>
              </div>
            </div>
          )}

          {error && (
            <Card className="mb-6 border-destructive">
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-destructive">{error}</p>
                  <Button onClick={handleRefresh} className="mt-4">
                    Reintentar
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {todayPrices && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <PriceIndicator prices={todayPrices} currentHour={currentHour} />
                
                <Card className="md:col-span-2 bg-opacity-50 backdrop-blur-sm">
                  <CardHeader className="pb-0">
                    <CardTitle className="text-lg">Ahora Mismo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      {currentHour >= 0 && currentHour < 7 
                        ? "Estás en horario valle 🌙 Los precios suelen ser más bajos durante la noche."
                        : currentHour >= 7 && currentHour < 10
                        ? "Estás en horario de mañana ☕ Los precios suelen ser medios en este horario."
                        : currentHour >= 10 && currentHour < 14
                        ? "Estás en horario punta de mañana ⚡ Los precios suelen ser altos."
                        : currentHour >= 14 && currentHour < 18
                        ? "Estás en horario de tarde 🕒 Los precios suelen ser medios en este horario."
                        : currentHour >= 18 && currentHour < 22
                        ? "Estás en horario punta de tarde ⚡ Los precios suelen ser más altos."
                        : "Estás en horario de noche 🌆 Los precios empiezan a bajar."
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Tabs defaultValue="today" className="mb-8" onValueChange={setActiveTab}>
                <div className="flex justify-between items-center mb-4">
                  <TabsList>
                    <TabsTrigger value="today" className="flex items-center">
                      <Calendar className="mr-1 h-4 w-4" />
                      Hoy
                    </TabsTrigger>
                    <TabsTrigger 
                      value="tomorrow" 
                      className="flex items-center"
                      disabled={!tomorrowPrices}
                    >
                      <CalendarClock className="mr-1 h-4 w-4" />
                      Mañana
                    </TabsTrigger>
                  </TabsList>
                  <div className="flex gap-2">
                    <Button 
                      variant={showHourlyBreakdown ? "default" : "outline"} 
                      size="sm" 
                      onClick={toggleHourlyBreakdown}
                    >
                      {showHourlyBreakdown ? "Ver gráfico" : "Ver desglose por horas"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRefresh}>
                      Actualizar
                    </Button>
                  </div>
                </div>

                <TabsContent value="today" className="mt-0">
                  <div className="mb-2">
                    <h2 className="text-xl font-semibold mb-1">{todayFormatted}</h2>
                    <p className="text-sm text-muted-foreground">
                      Datos actualizados a las {new Date().getHours()}:{String(new Date().getMinutes()).padStart(2, '0')}
                    </p>
                  </div>
                  
                  <div className="mb-6">
                    {showHourlyBreakdown ? (
                      <HourlyPriceBreakdown prices={todayPrices} currentHour={currentHour} />
                    ) : (
                      <PriceChart prices={todayPrices} currentHour={currentHour} />
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <BestHoursCard 
                      prices={todayPrices} 
                      title="Mejores horas para consumir hoy" 
                    />
                    <PricesSummary prices={todayPrices} />
                  </div>
                </TabsContent>
                
                <TabsContent value="tomorrow" className="mt-0">
                  {tomorrowPrices ? (
                    <>
                      <div className="mb-2">
                        <h2 className="text-xl font-semibold mb-1">{tomorrowFormatted}</h2>
                        <p className="text-sm text-muted-foreground">
                          Previsión para mañana
                        </p>
                      </div>
                      
                      <div className="mb-6">
                        {showHourlyBreakdown ? (
                          <HourlyPriceBreakdown prices={tomorrowPrices} />
                        ) : (
                          <PriceChart prices={tomorrowPrices} />
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <BestHoursCard 
                          prices={tomorrowPrices} 
                          title="Mejores horas para consumir mañana" 
                        />
                        <PricesSummary prices={tomorrowPrices} />
                      </div>
                    </>
                  ) : (
                    <Card>
                      <CardContent className="pt-6 text-center">
                        <p>Los precios para mañana aún no están disponibles.</p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Normalmente se publican a partir de las 20:00h.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
              
              <div className="bg-card p-4 rounded-lg">
                <h3 className="font-medium mb-2">Información sobre precios de la luz</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Los precios mostrados corresponden al precio voluntario para el pequeño consumidor (PVPC) 
                  publicado por Red Eléctrica de España. Estos precios se actualizan diariamente y varían 
                  cada hora según la demanda y producción de energía.
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Consejo:</strong> Intenta programar los electrodomésticos de mayor consumo 
                  (lavadora, secadora, lavavajillas) durante las horas más baratas para ahorrar en 
                  tu factura de la luz.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
