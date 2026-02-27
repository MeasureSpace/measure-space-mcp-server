# MCP Server for Measure Space API Services

[![smithery badge](https://smithery.ai/badge/@MeasureSpace/measure-space-mcp-server)](https://smithery.ai/server/@MeasureSpace/measure-space-mcp-server)

A Model Context Protocol (MCP) server for weather, climate, and air quality forecast and geocoding services from [measurespace.io](https://measurespace.io).

This repository contains **two implementations** of the same MCP server:

| Implementation | Folder | Package |
|---|---|---|
| 🐍 Python | [`python/`](./python/) | `mcp`, `measure-space-api` |
| 🟦 TypeScript | [`typescript/`](./typescript/) | `@measurespace/measure-space-mcp-server` |

## Features

- Hourly weather forecast for next 5 days
- Daily weather forecast for next 15 days
- Daily climate forecast for next 9 months
- Hourly and daily air quality forecast for next 4 days
- Geocoding: city name → latitude/longitude
- Geocoding: latitude/longitude → nearest city
- Timezone and astronomy data (sunrise, sunset)

## API Keys

Get your API keys from [measurespace.io](https://measurespace.io/pricing). Each service has its own key:

| Environment Variable | Service |
|---|---|
| `GEOCODING_API_KEY` | City ↔ lat/lon geocoding |
| `HOURLY_WEATHER_API_KEY` | Hourly weather forecast |
| `DAILY_WEATHER_API_KEY` | Daily weather forecast |
| `DAILY_CLIMATE_API_KEY` | Daily climate forecast |
| `AIR_QUALITY_API_KEY` | Air quality forecast |

You only need the key(s) for the services you use.

## Quick Start

See the implementation-specific READMEs:
- [Python implementation](./python/README.md)
- [TypeScript implementation](./typescript/README.md)
