export const FORECAST_DAYS = 30;

export const TIME_SLOT_HOURS = {
  morning: [8, 12],
  afternoon: [12, 17],
  evening: [17, 21],
  night: [21, 24],
} as const;

export const CONDITION_DESCRIPTIONS: Record<string, string> = {
  "clear-day": "Nice day",
  "clear-night": "Clear night",
  "partly-cloudy-day": "Partly cloudy",
  "partly-cloudy-night": "Partly cloudy night",
  "cloudy": "Cloudy day",
  "fog": "Foggy",
  "wind": "Windy",
  "rain": "Rainy day",
  "showers-day": "Scattered showers",
  "showers-night": "Scattered showers",
  "thunder-rain": "Thunderstorms",
  "thunder-showers-day": "Thunderstorms",
  "thunder-showers-night": "Thunderstorms",
  "snow": "Snowy day",
  "snow-showers-day": "Snow showers",
  "snow-showers-night": "Snow showers",
};

export const VISUAL_CROSSING_BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

export const VISUAL_CROSSING_API_PARAMS = {
  unitGroup: "us",
  include: "days,hours",
  elements:
    "datetime,temp,tempmax,tempmin,humidity,windspeed,conditions,icon,precipprob,source",
} as const;
