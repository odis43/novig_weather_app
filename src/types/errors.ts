export type WeatherErrorType =
  | "INVALID_LOCATION"
  | "RATE_LIMITED"
  | "NETWORK_ERROR";

export type WeatherError = { type: WeatherErrorType; message: string };
