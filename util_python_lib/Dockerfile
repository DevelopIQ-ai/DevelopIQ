# Use an official Python runtime as a parent image
FROM python:3.12

# Set the working directory to /app
WORKDIR /app

RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    curl

# Install Poetry
RUN pip install poetry

# Add Poetry to PATH
ENV PATH="/root/.local/bin:${PATH}"

# Copy only the necessary files for installation (avoid unnecessary cache invalidations)
COPY pyproject.toml poetry.lock /app/

# Copy the rest of the application files
COPY . /app

RUN poetry install --no-root

# Expose port 80 for FastAPI application
EXPOSE 8080

ENV FASTAPI_ENV production

WORKDIR /app/api

CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
