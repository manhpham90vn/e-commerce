#!/bin/sh

poetry install

poetry run uvicorn src.main:app --reload --host 0.0.0.0 --port 8080