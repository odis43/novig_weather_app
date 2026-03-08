import "./App.css";
import { useState } from "react";
import {
  DaySlotEnum,
  TimeSlotEnum,
  stringDaytoNum,
  type DaySlot,
  type TimeSlot,
} from "./types/weather";

import DayPicker from "./components/DayPicker";
import WeatherContainer from "./components/WeatherContainer";
import TimePicker from "./components/TimePicker";
import LocationPicker from "./components/LocationPicker";
import type { PlaceResult } from "./utils/places_api";
import { Switch } from "./components/ui/switch";
import { useTemperature } from "./context/TemperatureContext";

function App() {
  const [place, setPlace] = useState<PlaceResult | null>(null);
  const [day, setDay] = useState<DaySlot>(DaySlotEnum.MONDAY);
  const [timeOfDay, setTimeOfDay] = useState<TimeSlot>(TimeSlotEnum.MORNING);

  const { setUnit } = useTemperature();

  const handleToggle = (checked: boolean) => {
    setUnit(checked ? "M" : "I");
  };
  return (
    <div className="w-full h-screen bg-background p-4 md:p-10 flex flex-col">
      {/* Selector */}
      <Switch onCheckedChange={handleToggle} style={{ scale: 1.5 }} />
      <div className="px-3 md:px-20 py-3 md:py-4 flex flex-col flex-1 min-h-0">
        {/* Picker group */}
        <div className="flex flex-col gap-2 border-b-2 border-secondary pb-2 md:pb-4 md:flex-row md:mb-5 text-secondary text-sm md:text-base">
          <LocationPicker setSelectedPlace={setPlace} />
          <div className="flex flex-col gap-2 md:ml-auto md:flex-row">
            <DayPicker day={day} setDay={setDay} />
            <TimePicker timeOfDay={timeOfDay} setTimeOfDay={setTimeOfDay} />
          </div>
        </div>

        {/* Carousel */}
        <div className="flex-1 min-h-0 overflow-hidden mt-3 md:mt-5">
          <WeatherContainer
            place={place}
            location={place?.formattedAddress || place?.displayName || ""}
            day={stringDaytoNum(day)}
            timeOfDay={timeOfDay}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
