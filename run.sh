#!/bin/bash

# Tizen TV App - Docker Run Script

case "$1" in
    "dev")
        echo "Starting development environment..."
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    "prod")
        echo "Starting production environment..."
        docker-compose up --build
        ;;
    "stop")
        echo "Stopping all containers..."
        docker-compose down
        docker-compose -f docker-compose.dev.yml down
        ;;
    "clean")
        echo "Cleaning up Docker resources..."
        docker-compose down --rmi all --volumes --remove-orphans
        docker-compose -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans
        docker system prune -f
        ;;
    *)
        echo "Usage: $0 {dev|prod|stop|clean}"
        echo ""
        echo "Commands:"
        echo "  dev   - Start development environment with hot reload"
        echo "  prod  - Start production environment"
        echo "  stop  - Stop all running containers"
        echo "  clean - Stop containers and clean up Docker resources"
        echo ""
        echo "Examples:"
        echo "  ./run.sh dev    # Start development"
        echo "  ./run.sh prod   # Start production"
        echo "  ./run.sh stop   # Stop everything"
        echo "  ./run.sh clean  # Clean up everything"
        exit 1
        ;;
esac
