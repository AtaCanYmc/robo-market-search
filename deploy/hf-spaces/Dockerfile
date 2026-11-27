FROM python:3.12-slim

RUN pip install --no-cache-dir "robo-market-search[api]"

ENV HOST=0.0.0.0 \
    PORT=8000 \
    LOG_LEVEL=INFO \
    PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["robo-api"]
