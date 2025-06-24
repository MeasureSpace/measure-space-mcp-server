# MCP Server for Measure Space API Services

A Model Context Protocol (MCP) server for weather, climate, and air quality forecast and geocoding services from [measurespace.io](https://measurespace.io), built with FastAPI and the MCP framework. This server provides various weather, climate, air quality and geocoding related tools that can be used by AI assistants to retrieve weather, climate and air quality forecasts and more.

## Features

- Hourly weather forecast for next 5 days
- Daily weather forecast for next 15 days
- Daily climate forecast for next 9 months
- Hourly and daily air quality forecast for next 4 days
- Geocoding service for finding latitude and longitude for given city names
- Geocoding service for find nearest city for given latitude and longitude
- Timezone information
- Astronomy data (sunrise, sunset)

## Requirements

- Python 3.12+
- [uv](https://github.com/astral-sh/uv) package manager
- Related service API keys from [measurespace.io](https://measurespace.io/documentation#global-climate-forecast-variables)

## Installation

### Manual Installation

1. Clone this repository:

   ```
   git clone git@github.com:MeasureSpace/measure-space-mcp-server.git
   cd measure-space-mcp-server
   ```

2. Install dependencies using uv:

   ```
   uv venv
   uv pip install -e .
   ```

3. Create a `.env` file in the project root with your related API keys from [measurespace.io](https://measurespace.io/pricing):

   ```
   GEOCODING_API_KEY=<your-geocoding-api-key>
   HOURLY_WEATHER_API_KEY=<your-hourly-weather-api-key>
   DAILY_WEATHER_API_KEY=<your-daily-weather-api-key>
   DAILY_WEATHER_API_KEY=<your-daily-climate-api-key>
   AIR_QUALITY_API_KEY=<your-air-quality-api-key>
   ```

   Note that you only need the API key for the service your need.

## Usage

### Use the server with Claude Desktop App

Open the `cladue_desktop_config.json` file and add the following setup. Restart the Claude Desktop App. Please see [this tutorial](https://modelcontextprotocol.io/quickstart/server#testing-your-server-with-claude-for-desktop) if you don't know where to find the `cladue_desktop_config.json` file.

```json
{
  "mcpServers": {
    "MeasureSpace": {
      "command": "/<your_uv_path>/uv",
      "args": [
        "--directory",
        "/<your-measure-space-mcp-server-folder-path>/measure-space-mcp-server",
        "run",
        "main.py"
      ]
    }
  }
}
```

### Run the server

```bash
uv run main.py
```

The server will start on http://localhost:8000 by default.
