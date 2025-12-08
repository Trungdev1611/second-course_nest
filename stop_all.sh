#!/bin/bash

echo "-----------------------------"
echo "Stopping NestJS / Node processes..."
echo "-----------------------------"

pkill -f "node" 2>/dev/null && echo "Node processes stopped." || echo "No Node processes running."

echo "-----------------------------"
echo "Stopping all Docker containers..."
echo "-----------------------------"

docker stop $(docker ps -q) 2>/dev/null && echo "All containers stopped." || echo "No running containers."

echo "-----------------------------"
echo "Done."
echo "-----------------------------"
