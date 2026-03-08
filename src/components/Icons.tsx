import {
  Sun,
  Moon,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Wind,
  CloudFog,
  CloudDrizzle,
  Binoculars,
  ChartNoAxesColumn,
  TrendingUpDown,
  Snowflake,
  CloudRainWind,
  type LucideProps,
} from "lucide-react";

const weatherIconMap: Record<string, React.FC<LucideProps>> = {
  "snow": Snowflake,
  "snow-showers-day": CloudSnow,
  "snow-showers-night": CloudSnow,
  "thunder-rain": CloudLightning,
  "thunder-showers-day": CloudLightning,
  "thunder-showers-night": CloudLightning,
  "rain": CloudRain,
  "showers-day": CloudRainWind,
  "showers-night": CloudRainWind,
  "fog": CloudFog,
  "wind": Wind,
  "cloudy": Cloud,
  "partly-cloudy-day": Cloud,
  "partly-cloudy-night": Cloud,
  "clear-day": Sun,
  "clear-night": Moon,
};

const sourceIconMap: Record<string, React.FC<LucideProps>> = {
  "obs": Binoculars,
  "fcst": TrendingUpDown,
  "stats": ChartNoAxesColumn,
};

const SourceIcon = ({ source, size }: { source: string; size: number }) => {
  if (!(source in sourceIconMap)) {
    return null;
  }
  const Icon = sourceIconMap[source];
  return <Icon size={size} />;
};

const WeatherIcon = ({ icon, size }: { icon: string; size: number }) => {
  if (!(icon in weatherIconMap)) {
    return null;
  }
  const Icon = weatherIconMap[icon];
  return <Icon size={size} className="text-secondary" />;
};

export { WeatherIcon, SourceIcon };
