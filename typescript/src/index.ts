#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
    getHourlyWeather,
    getDailyWeather,
    getDailyClimate,
    getHourlyAirQuality,
    getDailyAirQuality,
    getLatLonFromCity,
    getCityFromLatLon,
    loadMetadata,
} from "./measureSpaceApi.js";

interface ServerConfig {
    geocodingApiKey: string;
    hourlyWeatherApiKey: string;
    dailyWeatherApiKey: string;
    dailyClimateApiKey: string;
    airQualityApiKey: string;
}

const unitSchema = z
    .enum(["metric", "imperial"])
    .default("metric")
    .describe("Unit system: 'metric' or 'imperial'");

export function createServer(config: ServerConfig): McpServer {
    const server = new McpServer({
        name: "MeasureSpaceMCP",
        version: "0.1.0",
    });

    server.tool(
        "daily_weather_forecast",
        "Get daily weather forecast for next 15 days.",
        {
            latitude: z.number().describe("Latitude of the location"),
            longitude: z.number().describe("Longitude of the location"),
            unit: unitSchema,
        },
        async ({ latitude, longitude, unit }) => {
            const inputVars =
                "tp,minT,maxT,timezone,sunrise,sunset,meanWindSpeed,meanWindDegree,minApparentT,maxApparentT";
            const result = await getDailyWeather(config.dailyWeatherApiKey, latitude, longitude, {
                variables: inputVars,
                unit,
            });
            const metadata = loadMetadata(inputVars, unit);
            return {
                content: [
                    { type: "text", text: JSON.stringify({ result, metadata }, null, 2) },
                ],
            };
        }
    );

    server.tool(
        "hourly_weather_forecast",
        "Get hourly weather forecast for next 5 days.",
        {
            latitude: z.number().describe("Latitude of the location"),
            longitude: z.number().describe("Longitude of the location"),
            unit: unitSchema,
        },
        async ({ latitude, longitude, unit }) => {
            const inputVars =
                "tp,t2m,timezone,windSpeed,windDegree,r2,d2m,sde,vis,sp,tcc,apparentT";
            const result = await getHourlyWeather(config.hourlyWeatherApiKey, latitude, longitude, {
                variables: inputVars,
                unit,
            });
            const metadata = loadMetadata(inputVars, unit);
            return {
                content: [
                    { type: "text", text: JSON.stringify({ result, metadata }, null, 2) },
                ],
            };
        }
    );

    server.tool(
        "daily_climate_forecast",
        "Get daily climate forecast for next 9 months.",
        {
            latitude: z.number().describe("Latitude of the location"),
            longitude: z.number().describe("Longitude of the location"),
            unit: unitSchema,
        },
        async ({ latitude, longitude, unit }) => {
            const inputVars = "t2m,tmin,tmax,u10,v10,sh2,st,soilw,prate,dswrf";
            const result = await getDailyClimate(config.dailyClimateApiKey, latitude, longitude, {
                variables: inputVars,
                unit,
            });
            const metadata = loadMetadata(inputVars, unit);
            return {
                content: [
                    { type: "text", text: JSON.stringify({ result, metadata }, null, 2) },
                ],
            };
        }
    );

    server.tool(
        "hourly_air_quality_forecast",
        "Get hourly air quality forecast for next 4 days.",
        {
            latitude: z.number().describe("Latitude of the location"),
            longitude: z.number().describe("Longitude of the location"),
        },
        async ({ latitude, longitude }) => {
            const inputVars = "CO,NO,NO2,SO2,O3,PM25,PM10,AQI,DP";
            const result = await getHourlyAirQuality(config.airQualityApiKey, latitude, longitude, {
                variables: inputVars,
            });
            const metadata = loadMetadata(inputVars, "metric");
            return {
                content: [
                    { type: "text", text: JSON.stringify({ result, metadata }, null, 2) },
                ],
            };
        }
    );

    server.tool(
        "daily_air_quality_forecast",
        "Get daily air quality forecast for next 4 days.",
        {
            latitude: z.number().describe("Latitude of the location"),
            longitude: z.number().describe("Longitude of the location"),
        },
        async ({ latitude, longitude }) => {
            const inputVars = "AQI,maxPM25,maxPM10,maxO3,maxSO2,maxNO2,maxNO,maxCO";
            const result = await getDailyAirQuality(config.airQualityApiKey, latitude, longitude, {
                variables: inputVars,
            });
            const metadata = loadMetadata(inputVars, "metric");
            return {
                content: [
                    { type: "text", text: JSON.stringify({ result, metadata }, null, 2) },
                ],
            };
        }
    );

    server.tool(
        "convert_city_to_latitude_longitude",
        "Find the latitude and longitude for a given city name.",
        {
            location_name: z.string().describe("City or location name to geocode"),
        },
        async ({ location_name }) => {
            const [latitude, longitude] = await getLatLonFromCity(
                config.geocodingApiKey,
                location_name
            );
            return {
                content: [
                    { type: "text", text: JSON.stringify({ latitude, longitude }, null, 2) },
                ],
            };
        }
    );

    server.tool(
        "find_nearest_city_from_latitude_longitude",
        "Find the nearest city for given latitude and longitude.",
        {
            latitude: z.number().describe("Latitude of the location"),
            longitude: z.number().describe("Longitude of the location"),
        },
        async ({ latitude, longitude }) => {
            const result = await getCityFromLatLon(
                config.geocodingApiKey,
                latitude,
                longitude
            );
            return {
                content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
            };
        }
    );

    return server;
}

// Required by Smithery to scan tools without real credentials
export function createSandboxServer(): McpServer {
    return createServer({
        geocodingApiKey: "sandbox-key",
        hourlyWeatherApiKey: "sandbox-key",
        dailyWeatherApiKey: "sandbox-key",
        dailyClimateApiKey: "sandbox-key",
        airQualityApiKey: "sandbox-key",
    });
}

async function main() {
    const config: ServerConfig = {
        geocodingApiKey: process.env.GEOCODING_API_KEY ?? "",
        hourlyWeatherApiKey: process.env.HOURLY_WEATHER_API_KEY ?? "",
        dailyWeatherApiKey: process.env.DAILY_WEATHER_API_KEY ?? "",
        dailyClimateApiKey: process.env.DAILY_CLIMATE_API_KEY ?? "",
        airQualityApiKey: process.env.AIR_QUALITY_API_KEY ?? "",
    };

    const server = createServer(config);
    const transport = new StdioServerTransport();
    await server.connect(transport);
    process.stderr.write("MeasureSpace MCP server running on stdio\n");
}

main().catch((err) => {
    process.stderr.write(`Fatal error: ${err}\n`);
    process.exit(1);
});
