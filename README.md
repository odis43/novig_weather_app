You must add .env variables to run this project:

- VITE_WEATHER_API_KEY=YOUR_KEY
- VITE_GOOGLE_MAPS_API_KEY=YOUR_KEY

- The weather api is configured from the visualcrossing api.
  -The google maps api key is configured from the places api.

- You can create an API key for the places api here:

1. Go to console.cloud.google.com
2. Create a new project (or select existing one)
3. Enable the Places API:
   - Search for "Places API" in the search bar
   - Click "Enable"
4. Create an API key:
   - Go to Credentials (left sidebar)
   - Click Create Credentials → API Key
   - Copy the key
