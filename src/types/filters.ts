import type { DayData, HourData } from "./weather";

export const weatherFilters = {
  filterByWeekday: (weekday: number) => (day: DayData) => {
    return new Date(day.datetime).getDay() === weekday;
  },
};

export const applyFilters = (
  days: DayData[],
  ...filters: ((day: DayData) => boolean)[]
): DayData[] => days.filter((day) => filters.every((filter) => filter(day)));

export const filterHours = (
  hours: HourData[] | undefined,
  startHour: number,
  endHour: number,
): HourData[] => {
  if (!hours) return [];
  return hours.filter((hour) => {
    const hourNum = parseInt(hour.datetime.split(":")[0], 10);
    return hourNum >= startHour && hourNum < endHour;
  });
};
