export interface HourData {
  datetime: string;
  temp: number;
  humidity: number;
  windspeed: number;
  conditions: string;
  icon: string;
  precipprob: number;
}

export interface DayData {
  source: string;
  datetime: string;
  temp: number;
  tempmax: number;
  tempmin: number;
  humidity: number;
  windspeed: number;
  conditions: string;
  icon: string;
  precipprob: number;
  hours: HourData[];
}

export interface WeatherResponse {
  address: string;
  resolvedAddress: string;
  days: DayData[];
}

export const TimeSlotEnum = {
  MORNING: "morning",
  AFTERNOON: "afternoon",
  EVENING: "evening",
  NIGHT: "night",
} as const;

export const DaySlotEnum = {
  MONDAY: "monday",
  TUESDAY: "tuesday",
  WEDNESDAY: "wednesday",
  THURSDAY: "thursday",
  FRIDAY: "friday",
  SATURDAY: "saturday",
  SUNDAY: "sunday",
} as const;

export type TimeSlot = (typeof TimeSlotEnum)[keyof typeof TimeSlotEnum];
export type DaySlot = (typeof DaySlotEnum)[keyof typeof DaySlotEnum];

const DAY_WEEKDAY_MAP = {
  monday: 0,
  tuesday: 1,
  wednesday: 2,
  thursday: 3,
  friday: 4,
  saturday: 5,
  sunday: 6,
} as const;

const WEEKDAY_DAY_MAP: Record<number, DaySlot> = {
  0: "monday",
  1: "tuesday",
  2: "wednesday",
  3: "thursday",
  4: "friday",
  5: "saturday",
  6: "sunday",
};

export const stringDaytoNum = (day: DaySlot): number => DAY_WEEKDAY_MAP[day];

export interface WeatherParams {
  location: string;
  selectedWeekday: number; // 0=Sun, 1=Mon, ... 6=Sat
  selectedTimeSlot: TimeSlot;
}

export type WeatherSource = "obs" | "fcst" | "stats";

export interface TempSummary {
  maxTemp: number;
  minTemp: number;
  average: number;
}

export interface ChartDataPoint {
  time: string;
  temp: number;
  humidity: number;
  windspeed: number;
  precipprob: number;
  conditions: string;
}
