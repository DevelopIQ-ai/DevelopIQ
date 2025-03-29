# Use an official Python image as a base
FROM python:3.10

# Set the working directory inside the container
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    python3-dev build-essential libssl-dev libffi-dev && \
    rm -rf /var/lib/apt/lists/*

# Install pip and Poetry
RUN pip install --upgrade pip && \
    pip install poetry==2.1.1

# Copy the project files to the container
COPY . /app/

# Install dependencies using Poetry
RUN poetry config virtualenvs.create false && \
    poetry install --no-interaction --no-ansi --no-root

# Expose the port FastAPI will run on
EXPOSE 8000

# Command to run the FastAPI application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]