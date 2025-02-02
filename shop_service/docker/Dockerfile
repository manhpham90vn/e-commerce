FROM python:3.12-alpine

RUN apk add --no-cache curl

ENV PYTHONDONTWRITEBYTECODE=1

RUN pip install pipx

RUN pipx install poetry

ENV PATH="/root/.local/bin:${PATH}"

WORKDIR /app

ENTRYPOINT [ "sh", "/app/docker/entrypoint.sh" ]
