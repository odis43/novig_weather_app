import type { DayData, WeatherParams, WeatherResponse } from "../types/weather";
import { getDateRange, getTimeSlotHours } from "./formatters";
import type { WeatherError } from "../types/errors";
import {
  VISUAL_CROSSING_BASE_URL,
  VISUAL_CROSSING_API_PARAMS,
} from "../config/constants";
import { applyFilters, weatherFilters, filterHours } from "../types/filters";

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
const BASE_URL = VISUAL_CROSSING_BASE_URL;

export const isWeatherError = (err: unknown): err is WeatherError => {
  return (
    typeof err === "object" && err !== null && "type" in err && "message" in err
  );
};

export async function fetchWeatherRange(
  params: WeatherParams,
  signal?: AbortSignal,
): Promise<DayData[]> {
  if (!API_KEY) {
    throw {
      type: "NETWORK_ERROR",
      message: "API key not configured",
    } satisfies WeatherError;
  }

  const { start, end } = getDateRange();
  const url = new URL(`${BASE_URL}/${params.location}/${start}/${end}`);

  url.searchParams.append("unitGroup", VISUAL_CROSSING_API_PARAMS.unitGroup);
  url.searchParams.append("include", VISUAL_CROSSING_API_PARAMS.include);
  url.searchParams.append("elements", VISUAL_CROSSING_API_PARAMS.elements);
  url.searchParams.append("key", API_KEY);

  try {
    const response = await fetch(url.toString(), { signal });

    if (!response.ok) {
      if (response.status === 404) {
        throw {
          type: "INVALID_LOCATION",
          message: `Location not found: ${params.location}`,
        } satisfies WeatherError;
      }
      if (response.status === 429) {
        throw {
          type: "RATE_LIMITED",
          message: "API rate limit exceeded",
        } satisfies WeatherError;
      }
      throw {
        type: "NETWORK_ERROR",
        message: `HTTP ${response.status}: ${response.statusText}`,
      } satisfies WeatherError;
    }

    const data: WeatherResponse = await response.json();
    const [startHour, endHour] = getTimeSlotHours(params.selectedTimeSlot);

    // Filter by weekday
    const results = applyFilters(
      data.days,
      weatherFilters.filterByWeekday(params.selectedWeekday),
    );

    return results.map((day) => ({
      ...day,
      hours: filterHours(day.hours, startHour, endHour),
    }));
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw error;
    }

    if (isWeatherError(error)) {
      throw error;
    }

    if (error instanceof TypeError) {
      throw {
        type: "NETWORK_ERROR",
        message: `Network request failed: ${error.message}`,
      } satisfies WeatherError;
    }

    if (error instanceof SyntaxError) {
      throw {
        type: "NETWORK_ERROR",
        message: "Invalid response format",
      } satisfies WeatherError;
    }

    throw {
      type: "NETWORK_ERROR",
      message: String(error),
    } satisfies WeatherError;
  }
}
