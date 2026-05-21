pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "960862432033"
        AWS_REGION = "ap-south-1"

        FRONTEND_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/frontend"
        BACKEND_REPO = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/backend"

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'master',
                url: 'https://github.com/devopsdileepkb/stackly-3-tier-app.git'
            }
        }

        stage('Verify Files') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Build Frontend Docker Image') {
            steps {
                sh """
                docker build -t frontend ./frontend
                docker tag frontend:latest $FRONTEND_REPO:$IMAGE_TAG
                docker tag frontend:latest $FRONTEND_REPO:latest
                """
            }
        }

        stage('Build Backend Docker Image') {
            steps {
                sh """
                docker build -t backend ./backend
                docker tag backend:latest $BACKEND_REPO:$IMAGE_TAG
                docker tag backend:latest $BACKEND_REPO:latest
                """
            }
        }

        stage('Login to AWS ECR') {
            steps {
                sh """
                aws ecr get-login-password --region $AWS_REGION | \
                docker login --username AWS --password-stdin \
                $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
                """
            }
        }

        stage('Push Frontend Image') {
            steps {
                sh """
                docker push $FRONTEND_REPO:$IMAGE_TAG
                docker push $FRONTEND_REPO:latest
                """
            }
        }

        stage('Push Backend Image') {
            steps {
                sh """
                docker push $BACKEND_REPO:$IMAGE_TAG
                docker push $BACKEND_REPO:latest
                """
            }
        }

        stage('Update Kubernetes Deployment') {
            steps {
                sh """
                kubectl set image deployment/frontend frontend=$FRONTEND_REPO:latest
                kubectl set image deployment/backend backend=$BACKEND_REPO:latest
                """
            }
        }

        stage('Verify Deployment') {
            steps {
                sh 'kubectl get pods'
                sh 'kubectl get svc'
            }
        }
    }

    post {
        success {
            echo 'Application deployed successfully to EKS'
        }

        failure {
            echo 'Pipeline failed'
        }
    }
}