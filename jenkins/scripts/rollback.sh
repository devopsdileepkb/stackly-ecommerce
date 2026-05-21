#!/bin/bash

set -e

echo "Rolling back deployment..."

# Get the previous deployment revision
PREVIOUS_REVISION=$(kubectl rollout history deployment/frontend -n stackly-ecommerce | tail -2 | head -1 | awk '{print $1}')

# Rollback frontend
if [ ! -z "$PREVIOUS_REVISION" ]; then
    echo "Rolling back frontend to revision $PREVIOUS_REVISION"
    kubectl rollout undo deployment/frontend -n stackly-ecommerce --to-revision=$PREVIOUS_REVISION
fi

# Rollback backend
PREVIOUS_REVISION=$(kubectl rollout history deployment/backend -n stackly-ecommerce | tail -2 | head -1 | awk '{print $1}')
if [ ! -z "$PREVIOUS_REVISION" ]; then
    echo "Rolling back backend to revision $PREVIOUS_REVISION"
    kubectl rollout undo deployment/backend -n stackly-ecommerce --to-revision=$PREVIOUS_REVISION
fi

echo "Rollback completed"
