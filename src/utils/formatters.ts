import type { TimeSlot } from "../types/weather";
import { FORECAST_DAYS, TIME_SLOT_HOURS } from "../config/constants";

//gets the start and end date for the forecast from today's date onward
export function getDateRange(): { start: string; end: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const endDate = new Date(today);
  endDate.setDate(endDate.getDate() + FORECAST_DAYS);

  const start = today.toISOString().split("T")[0];
  const end = endDate.toISOString().split("T")[0];

  return { start, end };
}

//returns the start and end hour for the time slot
export function getTimeSlotHours(slot: TimeSlot): readonly [number, number] {
  return TIME_SLOT_HOURS[slot];
}

//converts the 24 hour time to 12 hour time
export function convertTo12Hour(time24: string): string {
  const [hours, minutes] = time24.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${String(minutes).padStart(2, "0")} ${period}`;
}

//formats the date to a readable format
export function formatDate(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// temperature conversions (API returns Fahrenheit)
export function fahrenheitToCelsius(f: number): number {
  return Number(((f - 32) * (5 / 9)).toFixed(1));
}

export function mphToKmh(speed: number): number {
  return Number((speed * 1.60934).toFixed(1));
}
