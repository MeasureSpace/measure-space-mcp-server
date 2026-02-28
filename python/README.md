# MCP Server for Measure Space API — Python

A Python implementation of the MCP server for [measurespace.io](https://measurespace.io) weather, climate, air quality, and geocoding services. Built with [`FastMCP`](https://github.com/jlowin/fastmcp) from the `mcp` package.

## Requirements

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) package manager
- API keys from [measurespace.io](https://measurespace.io/pricing)

## Installation


### Manual

```bash
cd python/
uv venv
uv pip install -e .
```

Create a `.env` file:

```
GEOCODING_API_KEY=<your-key>
HOURLY_WEATHER_API_KEY=<your-key>
DAILY_WEATHER_API_KEY=<your-key>
DAILY_CLIMATE_API_KEY=<your-key>
AIR_QUALITY_API_KEY=<your-key>
AGRICULTURE_API_KEY=<your-key>
POLLEN_API_KEY=<your-key>
```

## Usage

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "MeasureSpace": {
      "command": "/path/to/uv",
      "args": ["--directory", "/path/to/measure-space-mcp-server/python", "run", "main.py"]
    }
  }
}
```

### Run directly

```bash
cd python/
python main.py
```

## Tools

| Tool | Description |
|---|---|
| `hourly_weather_forecast` | Hourly weather for next 5 days |
| `daily_weather_forecast` | Daily weather for next 15 days |
| `daily_climate_forecast` | Daily climate for next 9 months |
| `hourly_air_quality_forecast` | Hourly air quality for next 4 days |
| `daily_air_quality_forecast` | Daily air quality for next 4 days |
| `growing_degree_days` | Accumulated growing degree days for a period |
| `growth_stage` | Crop growth stage and GDD requirements |
| `heat_stress_days` | Number of heat stress days for a crop |
| `frost_stress_days` | Number of frost stress days for a crop |
| `daily_pollen_forecast` | Daily pollen forecast for next 5 days |
| `convert_city_to_latitude_longitude` | City name → lat/lon |
| `find_nearest_city_from_latitude_longitude` | Lat/lon → nearest city |

## Dependencies

- [`mcp`](https://pypi.org/project/mcp/) — MCP framework (`FastMCP`)
- [`measure-space-api`](https://pypi.org/project/measure-space-api/) — MeasureSpace API client
- [`python-dotenv`](https://pypi.org/project/python-dotenv/) — `.env` loading
