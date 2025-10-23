#!/bin/bash

# Docker management scripts for Evera Frontend

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Development commands
dev() {
    print_status "Starting development environment..."
    docker-compose --profile dev up --build
}

# dev-hot function removed as service was removed from docker-compose.yml

dev-detached() {
    print_status "Starting development environment in detached mode..."
    docker-compose --profile dev up -d --build
}

# Production commands
prod() {
    print_status "Starting production environment..."
    docker-compose --profile prod up --build
}

prod-detached() {
    print_status "Starting production environment in detached mode..."
    docker-compose --profile prod up -d --build
}

# Build commands
build-dev() {
    print_status "Building development image..."
    docker build --target development -t evera-frontend:dev .
}

build-prod() {
    print_status "Building production image..."
    docker build --target production -t evera-frontend:prod .
}

# Utility commands
stop() {
    print_status "Stopping all containers..."
    docker-compose down
}

clean() {
    print_status "Cleaning up containers and images..."
    docker-compose down --rmi all --volumes --remove-orphans
}

logs() {
    if [ -z "$1" ]; then
        print_status "Showing logs for all services..."
        docker-compose logs -f
    else
        print_status "Showing logs for $1..."
        docker-compose logs -f "$1"
    fi
}

shell() {
    if [ -z "$1" ]; then
        SERVICE="evera-frontend-dev"
    else
        SERVICE="$1"
    fi
    print_status "Opening shell in $SERVICE..."
    docker-compose exec "$SERVICE" sh
}

# Help function
help() {
    echo -e "${BLUE}Evera Frontend Docker Management${NC}"
    echo ""
    echo "Production commands:"
    echo "  prod             Start production environment"
    echo "  prod-detached    Start production in background"
    echo ""
    echo "Build commands:"
    echo "  build-dev        Build development image"
    echo "  build-prod       Build production image"
    echo ""
    echo "Utility commands:"
    echo "  stop             Stop all containers"
    echo "  clean            Clean up containers and images"
    echo "  logs [service]   Show logs (optionally for specific service)"
    echo "  shell [service]  Open shell in container"
    echo "  help             Show this help message"
    echo ""
    echo "Examples:"
    echo "  ./docker-scripts.sh dev"
    echo "  ./docker-scripts.sh prod-detached"
    echo "  ./docker-scripts.sh logs evera-frontend-dev"
    echo "  ./docker-scripts.sh shell"
}

# Main script logic
case "$1" in
    dev)
        dev
        ;;
# dev-hot case removed
    dev-detached)
        dev-detached
        ;;
    prod)
        prod
        ;;
    prod-detached)
        prod-detached
        ;;
    build-dev)
        build-dev
        ;;
    build-prod)
        build-prod
        ;;
    stop)
        stop
        ;;
    clean)
        clean
        ;;
    logs)
        logs "$2"
        ;;
    shell)
        shell "$2"
        ;;
    help|--help|-h)
        help
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        help
        exit 1
        ;;
esac
