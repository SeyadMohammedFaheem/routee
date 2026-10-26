// API Service Layer for Routee

const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;
const AVIATIONSTACK_API_KEY = process.env.EXPO_PUBLIC_AVIATIONSTACK_API_KEY;

// ==============================================
// REAL-TIME LOCATIONS (Geoapify)
// ==============================================

/**
 * Fetch destinations from Geoapify based on query
 */
export const searchDestinations = async (query: string) => {
  if (!GEOAPIFY_API_KEY) {
    console.warn("Geoapify API Key missing for destinations. Returning mock data.");
    return null; // Let the caller fallback to mock data
  }

  try {
    const response = await fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(query)}&type=city&format=json&apiKey=${GEOAPIFY_API_KEY}`);

    if (!response.ok) throw new Error("Failed to fetch destinations from Geoapify");
    const data = await response.json();
    
    return data.results.map((loc: any) => ({
      id: loc.place_id,
      name: loc.city || loc.name,
      code: loc.city || loc.name, // SerpApi Google Flights handles city names intelligently
      lat: loc.lat,
      lon: loc.lon,
      country: loc.country || ''
    }));
  } catch (error) {
    console.error("Error fetching destinations:", error);
    return null;
  }
};

// ==============================================
// REAL-TIME FLIGHTS (SerpApi - Google Flights)
// ==============================================

/**
 * Fetch flights from SerpApi (Google Flights) based on route
 */
export const searchFlights = async (flyFrom: string, flyTo: string, date: Date, adults: number, currency: string = 'INR') => {
  const serpApiKey = process.env.EXPO_PUBLIC_SERPAPI_KEY;
  if (!serpApiKey) {
    console.warn("SerpApi Key missing. Returning mock flights.");
    return null; 
  }

  // Ensure outbound date is never in the past (Google Flights requires future date)
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const targetDate = (!date || isNaN(date.getTime()) || date < now) 
    ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    : date;

  // Format date as YYYY-MM-DD
  const dateStr = targetDate.toISOString().split('T')[0];
  const currencyParam = (currency || 'INR').toUpperCase();

  try {
    const response = await fetch(`https://serpapi.com/search.json?engine=google_flights&departure_id=${encodeURIComponent(flyFrom)}&arrival_id=${encodeURIComponent(flyTo)}&outbound_date=${dateStr}&type=2&currency=${currencyParam}&adults=${adults || 1}&api_key=${serpApiKey}`);

    if (!response.ok) {
      const errJson = await response.json().catch(() => null);
      console.warn("SerpApi response warning:", errJson?.error || response.statusText);
      return null;
    }
    const data = await response.json();
    
    let flightsList = data.best_flights;
    if (!flightsList) {
      if (!data.other_flights) return null;
      flightsList = data.other_flights;
    }
    
    // Transform SerpApi Google Flights data into our app's format
    return flightsList.slice(0, 10).map((flight: any, index: number) => {
      const firstLeg = flight.flights[0];
      const lastLeg = flight.flights[flight.flights.length - 1];
      
      const formatTime = (timeStr: string) => {
        if (!timeStr) return '';
        const d = new Date(timeStr);
        if (isNaN(d.getTime())) return timeStr; // fallback if parsing fails
        return d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
      };

      // Duration is in minutes from SerpApi sometimes, or string
      let durationStr = "Unknown";
      if (typeof flight.total_duration === 'number') {
        const hrs = Math.floor(flight.total_duration / 60);
        const mins = flight.total_duration % 60;
        durationStr = `${hrs}h ${mins}m`;
      }

      return {
        id: flight.flight_ticket || index.toString(),
        airline: firstLeg.airline || 'Unknown Airline',
        code: firstLeg.airline?.substring(0, 2).toUpperCase() || 'FL',
        number: firstLeg.flight_number || '0000',
        depart: formatTime(firstLeg.departure_airport?.time),
        arrive: formatTime(lastLeg.arrival_airport?.time),
        duration: durationStr,
        price: flight.price || 0,
        stops: flight.flights.length - 1,
        baggage: 'Check pricing'
      };
    });
  } catch (error) {
    console.error("Error fetching flights:", error);
    return null;
  }
};

// ==============================================
// GEOAPIFY API (Places & Attractions)
// ==============================================

/**
 * Fetch a tourist attraction for a specific coordinate
 */
export const fetchTouristAttraction = async (lat: number, lon: number) => {
  if (!GEOAPIFY_API_KEY) {
    console.warn("Geoapify API Key missing. Returning mock attraction.");
    return null;
  }

  try {
    // Search for tourism.attraction within a 10km radius
    const response = await fetch(`https://api.geoapify.com/v2/places?categories=tourism.attraction&filter=circle:${lon},${lat},10000&limit=5&apiKey=${GEOAPIFY_API_KEY}`);
    if (!response.ok) throw new Error("Failed to fetch attractions");
    
    const data = await response.json();
    if (data.features && data.features.length > 0) {
      // Pick a random highly rated one (or just the first)
      const place = data.features[0].properties;
      return {
        name: place.name || "Local Landmark",
        category: "Attraction",
        address: place.address_line2 || ""
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching attractions:", error);
    return null;
  }
};

// ==============================================
// AVIATIONSTACK API (Flight Status)
// ==============================================

/**
 * Fetch live flight status
 */
export const fetchFlightStatus = async (flightIata: string) => {
  if (!AVIATIONSTACK_API_KEY) {
    console.warn("AviationStack API Key missing. Returning mock status.");
    return null;
  }

  try {
    // AviationStack free tier only supports HTTP
    const response = await fetch(`http://api.aviationstack.com/v1/flights?access_key=${AVIATIONSTACK_API_KEY}&flight_iata=${flightIata}&limit=1`);
    if (!response.ok) throw new Error("Failed to fetch flight status");
    
    const data = await response.json();
    if (data.data && data.data.length > 0) {
      const flight = data.data[0];
      return {
        status: flight.flight_status, // scheduled, active, landed, cancelled, incident, diverted
        departureDelay: flight.departure.delay,
        gate: flight.departure.gate,
        terminal: flight.departure.terminal
      };
    }
    return null;
  } catch (error) {
    console.error("Error fetching flight status:", error);
    return null;
  }
};
