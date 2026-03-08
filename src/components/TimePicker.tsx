import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type TimeSlot, TimeSlotEnum } from "@/types/weather";

interface TimePickerProps {
  timeOfDay: TimeSlot;
  setTimeOfDay: (value: TimeSlot) => void;
}
const TimePicker = ({ timeOfDay, setTimeOfDay }: TimePickerProps) => {
  return (
    <Select
      value={timeOfDay}
      onValueChange={(value) => setTimeOfDay(value as TimeSlot)}
    >
      <SelectTrigger className="w-full md:max-w-52 md:min-w-56 ">
        <SelectValue placeholder="Select a time of day" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Time of day</SelectLabel>
          <SelectItem value={TimeSlotEnum.MORNING}>
            Morning
          </SelectItem>
          <SelectItem value={TimeSlotEnum.AFTERNOON}>
            Afternoon
          </SelectItem>
          <SelectItem value={TimeSlotEnum.EVENING}>
            Evening
          </SelectItem>
          <SelectItem value={TimeSlotEnum.NIGHT}>
            Night
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default TimePicker;
