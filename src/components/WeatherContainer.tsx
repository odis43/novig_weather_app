import { useWeatherFetch } from "@/hooks/useWeatherFetch";
import {
  type TimeSlot,
  type ChartDataPoint,
  type WeatherSource,
} from "@/types/weather";
import type { PlaceResult } from "@/utils/places_api";
import { convertTo12Hour, formatDate } from "@/utils/formatters";
import WeatherCard from "./WeatherCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";

interface WeatherContainerProps {
  day: number;
  timeOfDay: TimeSlot;
  location: string;
  place: PlaceResult | null;
}

const WeatherContainer = ({
  day,
  timeOfDay,
  location,
  place,
}: WeatherContainerProps) => {
  const { data, loading, error } = useWeatherFetch(
    location,
    day,
    timeOfDay,
    place?.place_id,
  );
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return (
      <h1 className="w-full h-full text-primary font-oswald text-center text-4xl flex items-center justify-center">
        Loading...
      </h1>
    );
  }

  if (data.length == 0 && !loading) {
    return (
      <h1 className="w-full h-full text-primary font-oswald text-center text-4xl flex items-center justify-center">
        CHOOSE A LOCATION AND TIME OF DAY
      </h1>
    );
  }

  if (error) {
    return (
      <h1 className="w-full h-full text-destructive font-oswald text-center text-4xl flex items-center justify-center text-wrap">
        Error: {error}
      </h1>
    );
  } else {
    const allTemps = data.flatMap((d) =>
      d.hours.map((h) => Math.round(h.temp)),
    );
    const tempDomain: [number, number] = [
      Math.min(...allTemps),
      Math.max(...allTemps),
    ];

    return (
      <div className="w-full h-full flex items-center justify-center px-2 md:px-16">
        <Carousel
          className="w-full h-full"
          opts={{ slidesToScroll: isMobile ? 1 : 2 }}
        >
          <CarouselContent className="h-full">
            {data.map((dayData) => {
              const chartData: ChartDataPoint[] = dayData.hours.map((hour) => ({
                time: convertTo12Hour(hour.datetime.slice(0, 5)),
                temp: Math.round(hour.temp),
                humidity: hour.humidity,
                windspeed: hour.windspeed,
                precipprob: hour.precipprob,
                conditions: hour.conditions,
              }));
              return (
                <CarouselItem
                  key={dayData.datetime}
                  className="basis-full md:basis-1/2 h-full"
                >
                  <WeatherCard
                    source={dayData.source as WeatherSource}
                    condition={dayData.conditions}
                    tempData={{
                      maxTemp: dayData.tempmax,
                      minTemp: dayData.tempmin,
                      average: dayData.temp,
                    }}
                    conditionIcon={dayData.icon}
                    date={formatDate(dayData.datetime)}
                    chartData={chartData}
                    tempDomain={tempDomain}
                    windspeed={dayData.windspeed}
                    precipprob={dayData.precipprob}
                    hasHours={dayData.hours.length > 0}
                  />
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="cursor-pointer size-8 md:size-10" />
          <CarouselNext className="cursor-pointer size-8 md:size-10" />
        </Carousel>
      </div>
    );
  }
};

export default WeatherContainer;
