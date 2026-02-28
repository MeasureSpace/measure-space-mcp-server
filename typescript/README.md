# MCP Server for Measure Space API — TypeScript

A TypeScript implementation of the MCP server for [measurespace.io](https://measurespace.io) weather, climate, air quality, and geocoding services. Built with the `@modelcontextprotocol/sdk`.

## Requirements

- Node.js 18+
- API keys from [measurespace.io](https://measurespace.io/pricing)

## Installation

### Via npm

```bash
npx -y @measurespace/measure-space-mcp-server
```

### Manual

```bash
cd typescript/
npm install
npm run build
```

Set environment variables:

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
      "command": "node",
      "args": ["/path/to/measure-space-mcp-server/typescript/dist/index.js"],
      "env": {
        "GEOCODING_API_KEY": "<your-key>",
        "HOURLY_WEATHER_API_KEY": "<your-key>",
        "DAILY_WEATHER_API_KEY": "<your-key>",
        "DAILY_CLIMATE_API_KEY": "<your-key>",
        "AIR_QUALITY_API_KEY": "<your-key>",
        "AGRICULTURE_API_KEY": "<your-key>",
        "POLLEN_API_KEY": "<your-key>"
      }
    }
  }
}
```

### Run directly

```bash
cd typescript/
node dist/index.js
```

### Development

```bash
cd typescript/
npm run build   # compile TypeScript
```

## Tools

| Tool | Description |
|---|---|
| `hourly_weather_forecast` | Hourly weather for next 5 days |
| `daily_weather_forecast` | Daily weather for next 15 days |
| `daily_climate_forecast` | Daily climate for next 9 months |
| `hourly_air_quality_forecast` | Hourly air quality for next 4 days |
| `daily_air_quality_forecast` | Daily air quality for next 4 days |
| `growing_degree_days` | Accumulated growing degree days |
| `growth_stage` | Crop growth stage and GDD requirements |
| `heat_stress_days` | Number of heat stress days for a crop |
| `frost_stress_days` | Number of frost stress days for a crop |
| `daily_pollen_forecast` | Daily pollen forecast for next 5 days |
| `convert_city_to_latitude_longitude` | City name → lat/lon |
| `find_nearest_city_from_latitude_longitude` | Lat/lon → nearest city |

## MCP Registry

This package is published on the [MCP Registry](https://registry.modelcontextprotocol.io):

```bash
# Check registration
curl "https://registry.modelcontextprotocol.io/v0.1/servers?search=io.github.MeasureSpace"
```

## Architecture

The TypeScript implementation directly calls the MeasureSpace API endpoints using `fetch` (no npm wrapper package needed):

- `src/index.ts` — MCP server with all 12 tools
- `src/measureSpaceApi.ts` — HTTP client for all 12 MeasureSpace API endpoints
