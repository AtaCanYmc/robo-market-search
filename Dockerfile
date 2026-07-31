# Multi-stage Dockerfile for robo-market-search API

FROM python:3.11-slim as builder

WORKDIR /app

# Install build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy project files
COPY pyproject.toml README.md MANIFEST.in ./
COPY robo_market_search ./robo_market_search
COPY robo_market_service ./robo_market_service
COPY robo_market_agent ./robo_market_agent
COPY robo_market_api ./robo_market_api

# Install package with all dependencies
RUN pip install --no-cache-dir --upgrade pip wheel setuptools
RUN pip install --no-cache-dir ".[all]"

# Final lightweight runner stage
FROM python:3.11-slim as runner

WORKDIR /app

# Copy installed site-packages and binaries from builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin
COPY --from=builder /app /app

ENV HOST=0.0.0.0
ENV PORT=8000
ENV LOG_LEVEL=INFO
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

CMD ["robo-api"]
