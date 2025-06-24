import os
from mcp.server.fastmcp import FastMCP
from dotenv import load_dotenv
import logging
from measure_space_api import (
	get_hourly_weather,
	get_daily_weather,
	get_daily_climate,
	get_hourly_air_quality,
	get_daily_air_quality,
	get_lat_lon_from_city,
	get_city_from_lat_lon,
    get_metadata,
)
from typing import Literal

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
logger = logging.getLogger("MeasureSpaceMCP")

# Create an MCP server named "AdvancedWeather"
mcp = FastMCP(name="MeasureSpaceMCP",
              prompt="""
              This is a Weather, Climate, Air Quality and Geocoding server. 
              You can get weather, climate and air quality forecast and 
              geocoding information by calling the available tools.
              """
              )

load_dotenv()
geocoding_api_key = os.getenv('GEOCODING_API_KEY')
daily_weather_api_key = os.getenv('DAILY_WEATHER_API_KEY')
hourly_weather_api_key = os.getenv('HOURLY_WEATHER_API_KEY')
daily_climate_api_key = os.getenv('DAILY_CLIMATE_API_KEY')
air_quality_api_key = os.getenv('AIR_QUALITY_API_KEY')

def load_metadata(input_vars: str, unit: str=Literal['metric', 'imperial']):
    """Load variable metadata."""
    metadata = {}
    for x in input_vars.split(','):
        try:
            md=get_metadata(x, unit=unit)
            metadata[x] = md
        except Exception:
            logging.info(f'no metadata for {x}')

    return metadata

@mcp.tool()
async def daily_weather_forecast(latitude: float, longitude: float, unit: str=Literal['metric', 'imperial']):
    """Get daily weather forecast for next 15 days."""
    input_vars = 'tp,minT,maxT,timezone,sunrise,sunset,meanWindSpeed,meanWindDegree,minApparentT,maxApparentT'
    result = get_daily_weather(
        api_key=daily_weather_api_key, 
        latitude=latitude,
        longitude=longitude,
        params={'variables': input_vars, 'unit': unit},
        )
    metadata = load_metadata(input_vars, unit)

    return result, metadata

@mcp.tool()
async def hourly_weather_forecast(latitude: float, longitude: float, unit: str=Literal['metric', 'imperial']):
    """Get hourly weather forecast for next 5 days."""
    input_vars = 'tp,t2m,timezone,windSpeed,windDegree,r2,d2m,sde,vis,sp,tcc,apparentT'
    result = get_hourly_weather(
        api_key=hourly_weather_api_key, 
        latitude=latitude,
        longitude=longitude,
        params={'variables': input_vars, 'unit': unit},
        )
    metadata = load_metadata(input_vars, unit)

    return result, metadata

@mcp.tool()
async def daily_climate_forecast(latitude: float, longitude: float, unit: str=Literal['metric', 'imperial']):
    """Get daily climate forecast for next 9 months."""
    input_vars = 't2m,tmin,tmax,u10,v10,sh2,st,soilw,prate,dswrf'
    result = get_daily_climate(
        api_key=daily_climate_api_key, 
        latitude=latitude,
        longitude=longitude,
        params={'variables': input_vars, 'unit': unit},
        )
    metadata = load_metadata(input_vars, unit)

    return result, metadata

@mcp.tool()
async def hourly_air_quality_forecast(latitude: float, longitude: float):
    """Get hourly air quality forecast for next 4 days."""
    input_vars = 'CO,NO,NO2,SO2,O3,PM25,PM10,AQI,DP'
    result = get_hourly_air_quality(
        api_key=air_quality_api_key, 
        latitude=latitude,
        longitude=longitude,
        params={'variables': input_vars},
        )
    metadata = load_metadata(input_vars, 'metric')

    return result, metadata

@mcp.tool()
async def daily_air_quality_forecast(latitude: float, longitude: float):
    """Get daily air quality forecast for next 4 days."""
    input_vars = 'AQI,maxPM25,maxPM10,maxO3,maxSO2,maxNO2,maxNO,maxCO'
    result = get_daily_air_quality(
        api_key=air_quality_api_key, 
        latitude=latitude,
        longitude=longitude,
        params={'variables': input_vars},
        )
    metadata = load_metadata(input_vars, 'metric')

    return result, metadata

@mcp.tool()
async def convert_city_to_latitude_longitude(location_name: str):
    """Find the latitude and longitude for a given city name."""
    latitude, longitude = get_lat_lon_from_city(geocoding_api_key, location_name)

    return latitude, longitude

@mcp.tool()
async def find_nearest_city_from_latitude_longitude(latitude: float, longitude: float):
    """Find the nearest city for given latitude and longitude."""
    res = get_city_from_lat_lon(geocoding_api_key, latitude, longitude)

    return res

# Run the MCP server
if __name__ == "__main__":
    # This starts a Server-Sent Events (SSE) endpoint on port 8000
    mcp.run()