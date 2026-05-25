# Stackly Ecommerce Platform

A comprehensive 3-tier e-commerce platform built with modern web technologies and containerized with Docker and Kubernetes.

## Project Overview

This project implements a full-stack e-commerce platform with:
- **Frontend**: React-based user interface with responsive design
- **Backend**: Flask-based REST API with product and order management
- **Database**: MySQL database for persistent data storage
- **DevOps**: Docker, Docker Compose, Kubernetes, and Jenkins CI/CD pipeline
- **Monitoring**: Prometheus and Grafana for metrics and visualization

## Technology Stack

### Frontend
- React 18
- React Router for navigation
- CSS for styling
- Nginx for serving

### Backend
- Flask (Python 3.11)
- Flask-CORS for cross-origin requests
- MySQL connector for database
- Gunicorn for production server

### Database
- MySQL 8.0
    
### DevOps
- Docker & Docker Compose
- Kubernetes (K8s)
- Jenkins for CI/CD
- Prometheus for monitoring    hi
- Grafana for visualization

## Project Structure

```
stackly-ecommerce/
├── frontend/          # React application
├── backend/           # Flask API
├── database/          # SQL initialization scripts
├── k8s/              # Kubernetes manifests
├── jenkins/          # Jenkins configuration
├── docker-compose.yml # Local development setup
└── README.md         # This file
```

## Quick Start

### Local Development with Docker Compose

1. **Prerequisites**
   - Docker and Docker Compose installed
   - Git

2. **Setup and Run**
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd stackly-ecommerce

   # Start all services
   docker-compose up -d

   # Access the application
   # Frontend: http://localhost
   # Backend API: http://localhost:5000/api
   # MySQL: localhost:3306
   ```

3. **Stop Services**
   ```bash
   docker-compose down
   ```

### Kubernetes Deployment

1. **Prerequisites**
   - Kubernetes cluster (1.21+)
   - kubectl configured
   - Docker images pushed to registry

2. **Deploy**
   ```bash
   # Create namespace
   kubectl apply -f k8s/namespace.yaml

   # Deploy all components
   kubectl apply -f k8s/

   # Verify deployment
   kubectl get pods -n stackly-ecommerce
   kubectl get svc -n stackly-ecommerce
   ```

3. **Access Services**
   ```bash
   # Frontend
   kubectl port-forward svc/frontend 8080:80 -n stackly-ecommerce

   # Backend
   kubectl port-forward svc/backend 5000:5000 -n stackly-ecommerce

   # Prometheus
   kubectl port-forward svc/prometheus 9090:9090 -n stackly-ecommerce

   # Grafana
   kubectl port-forward svc/grafana 3000:3000 -n stackly-ecommerce
   ```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/<id>` - Get product by ID

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/<id>` - Get order by ID
- `POST /api/orders` - Create new order

### Health
- `GET /api/health` - Service health check
- `GET /api/ready` - Service readiness check

## Environment Variables

### Backend
```
FLASK_ENV=production
MYSQL_HOST=mysql
MYSQL_USER=ecommerce_user
MYSQL_PASSWORD=ecommerce_password
MYSQL_DB=ecommerce
```

### Frontend
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Jenkins CI/CD Pipeline

The Jenkins pipeline includes:
1. Code checkout
2. Frontend build and test
3. Backend build and test
4. Docker image push
5. Kubernetes deployment
6. Smoke tests
7. Automatic rollback on failure

### Run Pipeline
```bash
# Trigger pipeline with parameters
jenkins-cli build stackly-ecommerce \
  -p GIT_BRANCH=main \
  -p ENVIRONMENT=dev
```

## Monitoring

### Prometheus
- Metrics endpoint: `http://localhost:9090`
- Scrape interval: 15 seconds
- Monitors K8s pods and services

### Grafana
- Dashboard: `http://localhost:3000`
- Default credentials: admin/admin
- Pre-configured Prometheus datasource

## Database

### Initialize Database
```bash
# Using Docker Compose (automatic)
docker-compose up mysql

# Using Kubernetes
kubectl exec -it deployment/mysql -n stackly-ecommerce -- mysql -u root -p ecommerce < database/init.sql
```

### Sample Data
Sample data is automatically loaded from `database/sample-data.sql`

## Development Guidelines

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
python run.py
```

## Deployment Strategies

### Blue-Green Deployment
Use the deploy script to automatically handle blue-green deployments

### Canary Deployment
Adjust replica counts in K8s deployments for gradual rollout

### Rolling Updates
Kubernetes handles rolling updates automatically

## Troubleshooting

### MySQL Connection Issues
```bash
# Check MySQL pod logs
kubectl logs deployment/mysql -n stackly-ecommerce

# Verify connection
kubectl exec -it deployment/mysql -n stackly-ecommerce -- mysql -u root -p
```

### Backend Health Check
```bash
# Check backend status
curl http://backend:5000/api/health
kubectl logs deployment/backend -n stackly-ecommerce
```

### Frontend Issues
```bash
# Check frontend logs
kubectl logs deployment/frontend -n stackly-ecommerce

# Verify nginx configuration
kubectl exec -it deployment/frontend -n stackly-ecommerce -- cat /etc/nginx/conf.d/default.conf
```

## Scaling

### Horizontal Pod Autoscaling
```bash
kubectl autoscale deployment frontend --min=2 --max=10 -n stackly-ecommerce
kubectl autoscale deployment backend --min=2 --max=5 -n stackly-ecommerce
```

## Security Considerations

1. Update default secrets in `k8s/backend/secret.yaml`
2. Use TLS/SSL for production
3. Implement proper authentication/authorization
4. Regularly update dependencies
5. Scan docker images for vulnerabilities

## Contributing

1. Create a feature branch
2. Make your changes
3. Push to the repository
4. Create a pull request

## License

[Your License Here]

## Support

For issues and questions, please create an issue in the repository.

## Contact

For more information, contact the development team.
