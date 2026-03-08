import { useState, useEffect, useRef } from "react";
import { AlertCircle } from "lucide-react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { searchPlaces, type PlaceResult, type PlacesError } from "@/utils/places_api";

interface locationPickerProps {
  setSelectedPlace: (value: PlaceResult) => void;
}
const LocationPicker = ({ setSelectedPlace }: locationPickerProps) => {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<PlaceResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<PlacesError | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!input.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Debounce search
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setIsLoading(true);
    setError(null);

    debounceTimerRef.current = setTimeout(async () => {
      abortControllerRef.current = new AbortController();
      const result = await searchPlaces(
        input,
        abortControllerRef.current.signal,
      );

      if (result.success) {
        setResults(result.data);
        setError(null);
      } else {
        setResults([]);
        setError(result.error);
      }
      setIsLoading(false);
    }, 300);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [input]);

  return (
    <div className="relative">
      <Combobox>
        <ComboboxInput
          placeholder="Choose a location"
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <ComboboxContent>
          {isLoading ? (
            <ComboboxEmpty>Searching...</ComboboxEmpty>
          ) : error ? (
            <div className="px-2 py-2 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle size={16} />
              <span>{error.message}</span>
            </div>
          ) : results.length === 0 ? (
            <ComboboxEmpty>No locations found</ComboboxEmpty>
          ) : (
            <ComboboxList>
              {results.map((place) => (
                <ComboboxItem
                  key={place.place_id}
                  value={place.displayName}
                  onClick={() => {
                    setSelectedPlace(place);
                    setInput(place.displayName);
                    setResults([]);
                    setError(null);
                  }}
                >
                  <div className="cursor-pointer w-full">
                    <div className="font-medium text-primary">
                      {place.displayName}
                    </div>
                    {place.formattedAddress && (
                      <div className="text-xs text-secondary">
                        {place.formattedAddress}
                      </div>
                    )}
                  </div>
                </ComboboxItem>
              ))}
            </ComboboxList>
          )}
        </ComboboxContent>
      </Combobox>
    </div>
  );
};

export default LocationPicker;
