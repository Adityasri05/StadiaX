FROM python:3.12-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy and install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source files
COPY ./shared ./shared
COPY ./gateway ./gateway
COPY ./services ./services

# Configure python path to allow absolute imports
ENV PYTHONPATH=/app

# Default command - can be overridden in docker-compose.yml
CMD ["uvicorn", "gateway.main:app", "--host", "0.0.0.0", "--port", "8000"]
