import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type DaySlot, DaySlotEnum } from "@/types/weather";

interface DayPickerProps {
  day: DaySlot;
  setDay: (value: DaySlot) => void;
}

const DayPicker = ({ day, setDay }: DayPickerProps) => {
  return (
    <Select value={day} onValueChange={(value) => setDay(value as DaySlot)}>
      <SelectTrigger className="w-full md:max-w-52 md:min-w-56">
        <SelectValue placeholder="Select a day" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Day</SelectLabel>
          <SelectItem value={DaySlotEnum.MONDAY}>
            Every Monday
          </SelectItem>
          <SelectItem value={DaySlotEnum.TUESDAY}>
            Every Tuesday
          </SelectItem>
          <SelectItem value={DaySlotEnum.WEDNESDAY}>
            Every Wednesday
          </SelectItem>
          <SelectItem value={DaySlotEnum.THURSDAY}>
            Every Thursday
          </SelectItem>
          <SelectItem value={DaySlotEnum.FRIDAY}>
            Every Friday
          </SelectItem>
          <SelectItem value={DaySlotEnum.SATURDAY}>
            Every Saturday
          </SelectItem>
          <SelectItem value={DaySlotEnum.SUNDAY}>
            Every Sunday
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default DayPicker;
