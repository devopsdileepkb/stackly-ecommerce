#!/bin/bash

set -e

COMPONENT=$1
VERSION=${2:-v1}

echo "Building $COMPONENT..."

if [ "$COMPONENT" = "frontend" ]; then
    cd frontend
    docker build -t stackly-ecommerce:frontend-${VERSION} .
    cd ..
elif [ "$COMPONENT" = "backend" ]; then
    cd backend
    docker build -t stackly-ecommerce:backend-${VERSION} .
    cd ..
else
    echo "Unknown component: $COMPONENT"
    exit 1
fi

echo "$COMPONENT build completed successfully"
