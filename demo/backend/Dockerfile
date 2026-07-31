FROM python:3.11-slim as builder

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

COPY pyproject.toml README.md ./
COPY robo_market_search ./robo_market_search
COPY robo_market_service ./robo_market_service
COPY robo_market_agent ./robo_market_agent
COPY robo_market_api ./robo_market_api
COPY demo/backend ./demo/backend

RUN pip install --no-cache-dir --upgrade pip wheel setuptools
RUN pip install --no-cache-dir ".[all]"

FROM python:3.11-slim as runner

WORKDIR /app

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

CMD ["python", "demo/backend/main.py"]
