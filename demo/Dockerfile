# ── Build Stage ──
FROM python:3.11-slim as builder

WORKDIR /app

# System build dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies in a virtual environment
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY pyproject.toml README.md ./
COPY robo_market_search ./robo_market_search
COPY demo/requirements.txt ./demo/requirements.txt

RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -e . && \
    pip install --no-cache-dir -r demo/requirements.txt


# ── Final Stage ──
FROM python:3.11-slim

LABEL maintainer="Ata Can <atacanymc@gmail.com>"
LABEL description="Robo Market Search - FastAPI Web Demo"

WORKDIR /app

# Copy virtualenv from builder
COPY --from=builder /opt/venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1

# Copy source code and demo files
COPY pyproject.toml README.md ./
COPY robo_market_search ./robo_market_search
COPY demo ./demo

# Run as non-root user for security
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:8000/ || exit 1

WORKDIR /app/demo

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
