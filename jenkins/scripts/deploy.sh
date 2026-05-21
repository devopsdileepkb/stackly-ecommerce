#!/bin/bash

set -e

ENVIRONMENT=$1

if [ -z "$ENVIRONMENT" ]; then
    echo "Usage: deploy.sh <environment>"
    exit 1
fi

echo "Deploying to $ENVIRONMENT..."

# Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yaml

# Deploy database
kubectl apply -f k8s/mysql/secret.yaml
kubectl apply -f k8s/mysql/pvc.yaml
kubectl apply -f k8s/mysql/deployment.yaml
kubectl apply -f k8s/mysql/service.yaml

# Wait for MySQL to be ready
echo "Waiting for MySQL to be ready..."
kubectl wait --for=condition=ready pod -l app=mysql -n stackly-ecommerce --timeout=300s || true

# Deploy backend
kubectl apply -f k8s/backend/configmap.yaml
kubectl apply -f k8s/backend/deployment.yaml
kubectl apply -f k8s/backend/service.yaml

# Deploy frontend
kubectl apply -f k8s/frontend/deployment.yaml
kubectl apply -f k8s/frontend/service.yaml
kubectl apply -f k8s/frontend/ingress.yaml

# Deploy monitoring
kubectl apply -f k8s/monitoring/prometheus.yaml
kubectl apply -f k8s/monitoring/grafana.yaml

echo "Deployment to $ENVIRONMENT completed successfully"
