# syntax=docker/dockerfile:1
FROM python:3.12-slim

# Install uv
RUN pip install uv

# Set working directory
WORKDIR /app

# Copy project metadata and lock file
COPY pyproject.toml uv.lock ./

# Install dependencies using uv with the frozen lockfile
RUN uv sync --frozen --no-dev

# Copy the rest of the source code
COPY . .

# Start the MCP server
CMD ["uv", "run", "python", "main.py"]