#!/bin/bash

# -----------------------------
# Stop all running containers
# -----------------------------
echo "Stopping all running containers..."
docker stop $(docker ps -q) 2>/dev/null || echo "No running containers"

# -----------------------------
# Install npm dependencies
# -----------------------------
echo "Installing npm packages..."
npm install

# -----------------------------
# Run containers
# -----------------------------

# PostgreSQL
echo "Starting PostgreSQL container..."
# docker run -d \
#   --name second-course-nest \
#   -e POSTGRES_USER=postgres \ 
#   -e POSTGRES_PASSWORD=mysecretpassword \
#   -e POSTGRES_DB=fullstack \
#   -p 5432:5432 \
#   postgres:16
docker start pg_recover

# Elasticsearch
echo "Starting Elasticsearch container..."
# docker run -d \
#   --name elastic_dev \
#   -e "discovery.type=single-node" \
#   -p 9200:9200 \
#   -p 9300:9300 \
#   docker.elastic.co/elasticsearch/elasticsearch:8.11.0
docker start elasticsearch-container

# Redis
echo "Starting Redis container..."
# docker run -d \
#   --name redis_dev \
#   -p 6379:6379 \
#   redis:7
docker start redis-container

# -----------------------------
# Run npm dev server
# -----------------------------
# echo "Starting npm dev server..."
# npm run start:dev

# echo "Starting fronend....."
# npm run dev

# -----------------------------
# Run frontend + backend together
# -----------------------------
echo "Starting backend + frontend with concurrently... 
Backend: http: localhost:3001
FE: http://localhost:3000
"
npm run start:dev
# npx concurrently \
# "npm run start:dev" \
# "cd frontend && npm run dev"\
