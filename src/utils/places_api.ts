const GOOGLE_PLACES_API_URL = "https://places.googleapis.com/v1/places:searchText";

export interface PlaceResult {
  place_id: string;
  displayName: string;
  formattedAddress?: string;
}

export interface PlacesError {
  type: "NETWORK_ERROR" | "API_ERROR" | "INVALID_API_KEY";
  message: string;
}

export type PlacesResult =
  | { success: true; data: PlaceResult[] }
  | { success: false; error: PlacesError };

export async function searchPlaces(
  input: string,
  signal?: AbortSignal
): Promise<PlacesResult> {
  if (!input.trim()) {
    return { success: true, data: [] };
  }

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return {
      success: false,
      error: {
        type: "INVALID_API_KEY",
        message: "Maps API key is not configured",
      },
    };
  }

  try {
    const response = await fetch(GOOGLE_PLACES_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask":
          "places.id,places.displayName,places.formattedAddress",
      },
      body: JSON.stringify({
        textQuery: input,
      }),
      signal,
    });

    if (!response.ok) {
      return {
        success: false,
        error: {
          type: "API_ERROR",
          message:
            response.status === 429
              ? "Too many requests. Please try again later."
              : "Failed to search locations",
        },
      };
    }

    const data = await response.json();

    if (!data.places || data.places.length === 0) {
      return { success: true, data: [] };
    }

    return {
      success: true,
      data: data.places.map(
        (place: {
          id: string;
          displayName: { text: string };
          formattedAddress?: string;
        }) => ({
          place_id: place.id,
          displayName: place.displayName.text,
          formattedAddress: place.formattedAddress,
        })
      ),
    };
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return { success: false, error: { type: "NETWORK_ERROR", message: "Search cancelled" } };
    }
    return {
      success: false,
      error: {
        type: "NETWORK_ERROR",
        message: "Network error. Please check your connection.",
      },
    };
  }
}
