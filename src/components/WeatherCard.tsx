import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Wind, Calendar, Info, Umbrella, UmbrellaOff } from "lucide-react";

import { WeatherIcon } from "./Icons";

import { CONDITION_DESCRIPTIONS } from "@/config/constants";
import type {
  WeatherSource,
  TempSummary,
  ChartDataPoint,
} from "@/types/weather";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { useTemperature } from "@/context/TemperatureContext";
import { fahrenheitToCelsius, mphToKmh } from "@/utils/formatters";
import { useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WeatherCardProps {
  source: WeatherSource;
  condition: string;
  conditionIcon: string;
  date: string;
  windspeed: number;
  precipprob: number;
  tempData: TempSummary;
  tempDomain: [number, number];
  chartData: ChartDataPoint[];
  hasHours: boolean;
}

type MetricType = "humidity" | "windspeed" | "precipprob";

const MetricConfig = {
  humidity: {
    label: "Humidity (%)",
    dataKey: "humidity",
    color: "#10b981",
    domain: [0, 100],
  },
  windspeed: {
    label: "Wind Speed",
    dataKey: "windspeed",
    color: "#3b82f6",
    domain: [0, 50],
  },
  precipprob: {
    label: "Precip Prob (%)",
    dataKey: "precipprob",
    color: "#f59e0b",
    domain: [0, 100],
  },
};

const WeatherCard = ({
  source,
  condition,
  conditionIcon,
  date,
  tempData,
  chartData,
  tempDomain,
  windspeed,
  precipprob,
  hasHours,
}: WeatherCardProps) => {
  const { unit } = useTemperature();
  const [selectedMetric, setSelectedMetric] = useState<MetricType>("humidity");
  const metricConfig = MetricConfig[selectedMetric];

  const convertedChartData = useMemo(() => {
    return chartData.map((dataPoint) => ({
      ...dataPoint,
      temp: unit === "M" ? fahrenheitToCelsius(dataPoint.temp) : dataPoint.temp,
      windspeed:
        unit === "M" ? mphToKmh(dataPoint.windspeed) : dataPoint.windspeed,
    }));
  }, [unit, chartData]);

  const convertedAverage =
    unit === "M" ? fahrenheitToCelsius(tempData.average) : tempData.average;

  const convertedDomain: [number, number] =
    unit === "M"
      ? [fahrenheitToCelsius(tempDomain[0]), fahrenheitToCelsius(tempDomain[1])]
      : tempDomain;

  return (
    <div className="flex flex-col h-full">
      {/* Descriptors */}
      <div className="flex flex-col items-start w-full text-secondary">
        <h1 className="font-oswald text-2xl md:text-3xl font-bold text-primary text-left mb-2">
          {date}
        </h1>
        <div className="flex flex-col md:flex-row items-start gap-2 md:gap-4 h-auto md:h-30 mt-2 w-full">
          <WeatherIcon icon={conditionIcon} size={75} />
          <div className="flex flex-col gap-1 font-inter">
            <span className="flex items-center align-baseline gap-x-2">
              <Calendar size={15} />
              <p className="flex flex-row gap-x-2">
                <span className="font-bold">
                  {CONDITION_DESCRIPTIONS[conditionIcon] || condition}
                </span>
                | {Math.round(convertedAverage)}°{unit === "M" ? "C" : "F"}
              </p>
              {source !== "fcst" ? (
                <HoverCard openDelay={10} closeDelay={100}>
                  <HoverCardTrigger asChild>
                    <Info size={15} className="text-primary cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="flex w-64 flex-col gap-0.5 bg-background rounded-xl text-secondary p-3 border-foreground border">
                    <h1>This data is based on historical averages.</h1>
                  </HoverCardContent>
                </HoverCard>
              ) : null}
            </span>
            <span className="flex items-center align-baseline gap-x-2">
              <Wind size={15} />
              <p>
                Winds: {unit === "M" ? mphToKmh(windspeed) : windspeed}{" "}
                {unit === "M" ? "km/h" : "mph"}
              </p>
            </span>
            <span className="flex items-center align-baseline gap-x-2">
              {precipprob === 0 ? (
                <UmbrellaOff size={15} />
              ) : (
                <Umbrella size={15} />
              )}
              <p>
                {precipprob === 0 ? "no rain" : `${precipprob}% chance of rain`}
              </p>
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1 min-h-0 mt-2">
        {hasHours && (
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-secondary">
              Metric:
            </label>
            <Select
              value={selectedMetric}
              onValueChange={(value) => setSelectedMetric(value as MetricType)}
            >
              <SelectTrigger className="w-40 text-secondary">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="humidity">Humidity</SelectItem>
                <SelectItem value="windspeed">Wind Speed</SelectItem>
                <SelectItem value="precipprob">Precipitation Prob</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
        {hasHours ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={convertedChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis
                domain={convertedDomain}
                yAxisId="left"
                label={{
                  value: `Temp (°${unit === "M" ? "C" : "F"})`,
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                domain={metricConfig.domain}
                tick={{ dx: -2 }}
                label={{
                  value: metricConfig.label,
                  angle: 90,
                  position: "center",
                  offset: 100,
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;
                  const conditions = payload[0]?.payload?.conditions;
                  return (
                    <div className="bg-accent rounded-lg p-3 shadow-md font-inter text-sm">
                      <p className="font-semibold mb-1 text-primary">{label}</p>
                      {conditions && (
                        <p className="text-secondary mb-2">{conditions}</p>
                      )}
                      {payload.map((entry) => (
                        <p key={entry.name} style={{ color: entry.color }}>
                          {entry.name}: {entry.value}
                          {entry.name === "Temperature" &&
                            ` (°${unit === "M" ? "C" : "F"})`}
                          {entry.name === "Wind Speed" &&
                            ` (${unit === "M" ? "km/h" : "mph"})`}
                          {entry.name === "Precipitation Prob" && ` (%)`}
                        </p>
                      ))}
                    </div>
                  );
                }}
              />
              <Legend />
              <Line
                strokeWidth={2}
                yAxisId="left"
                type="monotone"
                dataKey="temp"
                stroke="#ff0000"
                dot={true}
                name="Temperature"
              />
              <Line
                strokeWidth={2}
                yAxisId="right"
                type="monotone"
                dataKey={metricConfig.dataKey}
                stroke={metricConfig.color}
                dot={true}
                name={metricConfig.label}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center">
            <h1 className="font-oswald md:text-2xl text-primary">
              No hourly data available
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherCard;
