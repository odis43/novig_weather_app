import { useState, useEffect } from "react";
import type { DayData, TimeSlot } from "../types/weather";
import { fetchWeatherRange, isWeatherError } from "../utils/weather_api";

interface UseWeatherFetchResult {
  data: DayData[];
  loading: boolean;
  error: string | null;
}

export function useWeatherFetch(
  location: string,
  selectedWeekday: number,
  selectedTimeSlot: TimeSlot,
  placeId?: string,
): UseWeatherFetchResult {
  const [data, setData] = useState<DayData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!location.trim()) {
      setData([]);
      setError(null);
      setLoading(false);
      return;
    }

    const cacheKey = `weather_${placeId || location}|${selectedWeekday}|${selectedTimeSlot}`;

    const cached = sessionStorage.getItem(cacheKey);
    const cacheTime = sessionStorage.getItem(`${cacheKey}_time`);
    const isCacheFresh =
      cacheTime && Date.now() - parseInt(cacheTime) < 1000 * 60 * 30;

    if (cached && isCacheFresh) {
      setData(JSON.parse(cached));
      setError(null);
      return;
    }

    const abortController = new AbortController();
    let isMounted = true;

    const fetchData = async () => {
      setError(null);
      setLoading(true);
      try {
        const result = await fetchWeatherRange(
          { location, selectedWeekday, selectedTimeSlot },
          abortController.signal,
        );

        if (isMounted) {
          setData(result);
          setError(null);
          sessionStorage.setItem(cacheKey, JSON.stringify(result));
          sessionStorage.setItem(`${cacheKey}_time`, Date.now().toString());
        }
      } catch (err) {
        if (abortController.signal.aborted || !isMounted) return;

        const errorMessage = isWeatherError(err)
          ? err.message
          : err instanceof Error
            ? err.message
            : "Unknown error occurred";
        setError(errorMessage);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Fetch fresh data (cache was stale or missing)
    fetchData();

    return () => {
      isMounted = false;
      abortController.abort();
    };
  }, [location, selectedWeekday, selectedTimeSlot, placeId]);

  return { data, loading, error };
}
