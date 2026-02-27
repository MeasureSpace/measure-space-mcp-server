// MeasureSpace API client — TypeScript port of the measure-space-api Python library.
// Makes GET requests to AWS API Gateway endpoints with X-API-Key authentication.

const URL_MAPPING: Record<string, string> = {
  hourly_weather:
    "https://q0np6mu0vi.execute-api.us-east-1.amazonaws.com/prd/global-hourly-weather-forecast",
  daily_weather:
    "https://4y0sy5lved.execute-api.us-east-1.amazonaws.com/prd/global-daily-weather-forecast",
  daily_climate:
    "https://d43arqqeh8.execute-api.us-east-1.amazonaws.com/prd/global-daily-climate-forecast",
  hourly_air_quality:
    "https://pawsqe3sob.execute-api.us-east-1.amazonaws.com/prd/global-hourly-air-quality-forecast",
  daily_air_quality:
    "https://pawsqe3sob.execute-api.us-east-1.amazonaws.com/prd/global-daily-air-quality-forecast",
  geocoding_nearest_city:
    "https://ncstsm9hel.execute-api.us-east-1.amazonaws.com/prd/nearest-city",
  geocoding_autocomplete:
    "https://ncstsm9hel.execute-api.us-east-1.amazonaws.com/prd/autocomplete",
};

const DESCRIPTION_MAPPING: Record<string, string> = {
  weatherCode: "weather code used for weather icons",
  timezone: "time zone name",
  sunrise: "sunrise time",
  sunset: "sunset time",
  tp: "total precipitation",
  minT: "daily minimum temperature",
  maxT: "daily maximum temperature",
  meanT: "daily mean temperature",
  meanUWind: "daily mean eastward wind",
  meanVWind: "daily mean northward wind",
  meanwindSpeed: "daily mean wind speed",
  meanwindDegree: "daily mean wind direction (0-north, 180-south, clockwise)",
  meanRH: "daily mean relative humidity",
  meanDP: "daily mean dew point temperature",
  snow: "daily accumulated snow depth",
  sunshine: "daily accumulated sunshine duration",
  solarR: "daily accumulated downward shortwave radiation flux",
  meanVis: "daily mean visibility",
  pressure: "daily mean pressure",
  meanST: "daily mean top soil temperature",
  maxST: "daily maximum top soil temperature",
  minST: "daily minimum top soil temperature",
  meanSoilw: "daily mean top soil moisture",
  crain: "rain (1) or not (0)",
  csnow: "snow (1) or not (0)",
  cicep: "ice pellets (1) or not (0)",
  cfrzr: "freezing rain (1) or not (0)",
  meanTcc: "daily mean total cloud cover",
  maxPrate: "daily max precipitation rate",
  maxCape: "daily max surface convective available potential energy",
  precipType:
    "precipitation type (0-no precip, 1-rain, 2-snow, 3-freezing rain, 4-ice pellets)",
  minApparentT: "minimum apparent temperature (i.e. feels-like temperature)",
  maxApparentT: "maximum apparent temperature (i.e. feels-like temperature)",
  t2m: "2m air temperature",
  tmin: "daily minimum air temperature",
  tmax: "daily maximum air temperature",
  u10: "10m eastward wind",
  v10: "10m northward wind",
  sh2: "daily mean specific humidity",
  st: "top soil temperature",
  soilw: "top soil moisture",
  prate: "precipitation rate",
  sdwe: "daily total water equivalent snow depth",
  dswrf: "downward shortwave radiation flux",
  CO: "carbon monoxide concentration",
  NO: "nitric monoxide concentration",
  NO2: "nitrogen monoxide concentration",
  SO2: "sulfur monoxide concentration",
  O3: "ozone concentration",
  PM25: "particulate matter 2.5 concentration",
  PM10: "particulate matter 10 concentration",
  AQI: "air quality index",
  DP: "dominant pollutant according to AQI",
  meanCO: "daily mean carbon monoxide concentration",
  meanNO: "daily mean nitric monoxide concentration",
  meanNO2: "daily mean nitrogen monoxide concentration",
  meanSO2: "daily mean sulfur monoxide concentration",
  meanO3: "daily mean ozone concentration",
  meanPM25: "daily mean particulate matter 2.5 concentration",
  meanPM10: "daily mean particulate matter 10 concentration",
  maxCO: "daily maximum carbon monoxide concentration",
  maxNO: "daily maximum nitric monoxide concentration",
  maxNO2: "daily maximum nitrogen monoxide concentration",
  maxSO2: "daily maximum sulfur monoxide concentration",
  maxO3: "daily maximum ozone concentration",
  maxPM25: "daily maximum particulate matter 2.5 concentration",
  maxPM10: "daily maximum particulate matter 10 concentration",
};

const UNIT_MAPPING: Record<string, Record<string, string>> = {
  metric: {
    tp: "mm", t2m: "C", u10: "km/h", v10: "km/h", windSpeed: "km/h",
    windDegree: "degree", r2: "%", d2m: "C", sde: "m", sunsd: "s",
    dswrf: "w/m^2", vis: "km", sp: "Pa", st: "C", crain: "0/1",
    csnow: "0/1", cicep: "0/1", cfrzr: "0/1", tcc: "%", prate: "kg/m^2/s",
    cape: "J/kg", precipType: "0/1/2/3/4", apparentT: "C", minT: "C",
    maxT: "C", meanT: "C", meanUWind: "km/h", meanVWind: "km/h",
    meanwindSpeed: "km/h", meanwindDegree: "degree", meanRH: "%", meanDP: "C",
    snow: "m", sunshine: "s", solarR: "w/m^2", meanVis: "km", pressure: "Pa",
    meanST: "C", maxST: "C", minST: "C", meanTcc: "%", maxPrate: "kg/m^2/s",
    maxCape: "J/kg", minApparentT: "C", maxApparentT: "C", tmin: "C",
    tmax: "C", sh2: "%", sdwe: "m", CO: "µg/m^3", NO: "µg/m^3",
    NO2: "µg/m^3", SO2: "µg/m^3", O3: "µg/m^3", PM25: "µg/m^3",
    PM10: "µg/m^3", meanCO: "µg/m^3", meanNO: "µg/m^3", meanNO2: "µg/m^3",
    meanSO2: "µg/m^3", meanO3: "µg/m^3", meanPM25: "µg/m^3",
    meanPM10: "µg/m^3", maxCO: "µg/m^3", maxNO: "µg/m^3", maxNO2: "µg/m^3",
    maxSO2: "µg/m^3", maxO3: "µg/m^3", maxPM25: "µg/m^3", maxPM10: "µg/m^3",
  },
  imperial: {
    tp: "inch", t2m: "F", u10: "miles/h", v10: "miles/h", windSpeed: "miles/h",
    windDegree: "degree", r2: "%", d2m: "F", sde: "inch", sunsd: "s",
    dswrf: "w/m^2", vis: "miles", sp: "Pa", st: "F", crain: "0/1",
    csnow: "0/1", cicep: "0/1", cfrzr: "0/1", tcc: "%", prate: "kg/m^2/s",
    cape: "J/kg", precipType: "0/1/2/3/4", apparentT: "F", minT: "F",
    maxT: "F", meanT: "F", meanUWind: "miles/h", meanVWind: "miles/h",
    meanwindSpeed: "miles/h", meanwindDegree: "degree", meanRH: "%", meanDP: "F",
    snow: "inch", sunshine: "s", solarR: "w/m^2", meanVis: "miles",
    pressure: "Pa", meanST: "F", maxST: "F", minST: "F", meanTcc: "%",
    maxPrate: "kg/m^2/s", maxCape: "J/kg", minApparentT: "F", maxApparentT: "F",
    tmin: "F", tmax: "F", sh2: "%", sdwe: "inch", CO: "µg/m^3", NO: "µg/m^3",
    NO2: "µg/m^3", SO2: "µg/m^3", O3: "µg/m^3", PM25: "µg/m^3",
    PM10: "µg/m^3", meanCO: "µg/m^3", meanNO: "µg/m^3", meanNO2: "µg/m^3",
    meanSO2: "µg/m^3", meanO3: "µg/m^3", meanPM25: "µg/m^3",
    meanPM10: "µg/m^3", maxCO: "µg/m^3", maxNO: "µg/m^3", maxNO2: "µg/m^3",
    maxSO2: "µg/m^3", maxO3: "µg/m^3", maxPM25: "µg/m^3", maxPM10: "µg/m^3",
  },
};

async function callApi(
  apiKey: string,
  apiUrl: string,
  params: Record<string, string | number | boolean>
): Promise<unknown> {
  const url = new URL(apiUrl);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, String(v));
  }
  const response = await fetch(url.toString(), {
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`API Error: ${response.status} - ${text}`);
  }
  return response.json();
}

export async function getLatLonFromCity(
  apiKey: string,
  locationName: string
): Promise<[number | null, number | null]> {
  const res = (await callApi(apiKey, URL_MAPPING.geocoding_autocomplete, {
    query: locationName,
    limit: 1,
  })) as { results?: { lat: number; lon: number }[] };

  if (res.results && res.results.length > 0) {
    return [res.results[0].lat, res.results[0].lon];
  }
  return [null, null];
}

export async function getCityFromLatLon(
  apiKey: string,
  latitude: number,
  longitude: number
): Promise<unknown> {
  const res = (await callApi(apiKey, URL_MAPPING.geocoding_nearest_city, {
    lat: latitude,
    lon: longitude,
    limit: 1,
  })) as { results?: unknown[] };

  if (res.results && res.results.length > 0) {
    return res.results[0];
  }
  return "Not Found";
}

export async function getHourlyWeather(
  apiKey: string,
  latitude: number,
  longitude: number,
  params: Record<string, string>
): Promise<unknown> {
  return callApi(apiKey, URL_MAPPING.hourly_weather, {
    latitude,
    longitude,
    ...params,
  });
}

export async function getDailyWeather(
  apiKey: string,
  latitude: number,
  longitude: number,
  params: Record<string, string>
): Promise<unknown> {
  return callApi(apiKey, URL_MAPPING.daily_weather, {
    latitude,
    longitude,
    ...params,
  });
}

export async function getDailyClimate(
  apiKey: string,
  latitude: number,
  longitude: number,
  params: Record<string, string>
): Promise<unknown> {
  return callApi(apiKey, URL_MAPPING.daily_climate, {
    latitude,
    longitude,
    ...params,
  });
}

export async function getHourlyAirQuality(
  apiKey: string,
  latitude: number,
  longitude: number,
  params: Record<string, string>
): Promise<unknown> {
  return callApi(apiKey, URL_MAPPING.hourly_air_quality, {
    latitude,
    longitude,
    ...params,
  });
}

export async function getDailyAirQuality(
  apiKey: string,
  latitude: number,
  longitude: number,
  params: Record<string, string>
): Promise<unknown> {
  return callApi(apiKey, URL_MAPPING.daily_air_quality, {
    latitude,
    longitude,
    ...params,
  });
}

export function getMetadata(
  varName: string,
  unit: "metric" | "imperial"
): { description: string | undefined; unit: string | undefined } {
  return {
    description: DESCRIPTION_MAPPING[varName],
    unit: UNIT_MAPPING[unit]?.[varName],
  };
}

export function loadMetadata(
  inputVars: string,
  unit: "metric" | "imperial"
): Record<string, { description: string | undefined; unit: string | undefined }> {
  const metadata: Record<string, { description: string | undefined; unit: string | undefined }> = {};
  for (const v of inputVars.split(",").map((s) => s.trim())) {
    try {
      metadata[v] = getMetadata(v, unit);
    } catch {
      // skip unknown vars
    }
  }
  return metadata;
}
