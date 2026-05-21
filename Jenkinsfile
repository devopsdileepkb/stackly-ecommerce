pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "960862432033"
        AWS_REGION     = "ap-south-1"

        FRONTEND_REPO = "960862432033.dkr.ecr.ap-south-1.amazonaws.com/frontend"
        BACKEND_REPO  = "960862432033.dkr.ecr.ap-south-1.amazonaws.com/backend"
    }

    stages {

        /* ================= IMAGE TAG ================= */
        stage('Set Image Tag') {
            steps {
                script {
                    env.IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                    echo "Image Tag: ${env.IMAGE_TAG}"
                }
            }
        }

        /* ================= VERIFY CODE ================= */
        stage('Verify Workspace') {
            steps {
                sh 'ls -la'
            }
        }

        /* ================= AWS LOGIN ================= */
        stage('Login to AWS ECR') {
            steps {
                withCredentials([[ $class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-devops-creds' ]]) {
                    sh """
                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    """
                }
            }
        }

        /* ================= BUILD IMAGES ================= */
        stage('Build Docker Images') {
            steps {
                sh """
                echo "Building Frontend..."
                docker build -t frontend ./frontend

                echo "Building Backend..."
                docker build -t backend ./backend
                """
            }
        }

        /* ================= TAG IMAGES ================= */
        stage('Tag Images') {
            steps {
                sh """
                docker tag frontend:latest $FRONTEND_REPO:$IMAGE_TAG
                docker tag frontend:latest $FRONTEND_REPO:latest

                docker tag backend:latest $BACKEND_REPO:$IMAGE_TAG
                docker tag backend:latest $BACKEND_REPO:latest
                """
            }
        }

        /* ================= PUSH IMAGES ================= */
        stage('Push to ECR') {
            steps {
                sh """
                docker push $FRONTEND_REPO:$IMAGE_TAG
                docker push $FRONTEND_REPO:latest

                docker push $BACKEND_REPO:$IMAGE_TAG
                docker push $BACKEND_REPO:latest
                """
            }
        }

        /* ================= DEPLOY TO EKS ================= */
        stage('Deploy to EKS') {
            steps {
                withCredentials([[ $class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-devops-creds' ]]) {
                    sh """
                    aws eks update-kubeconfig --region $AWS_REGION --name stackly-cluster

                    kubectl create namespace stackly --dry-run=client -o yaml | kubectl apply -f -

                    echo "Applying Kubernetes manifests..."
                    kubectl apply -f k8s/backend/ -n stackly
                    kubectl apply -f k8s/frontend/ -n stackly

                    echo "Updating image versions..."
                    kubectl set image deployment/frontend frontend=$FRONTEND_REPO:$IMAGE_TAG -n stackly
                    kubectl set image deployment/backend backend=$BACKEND_REPO:$IMAGE_TAG -n stackly
                    """
                }
            }
        }

        /* ================= VERIFY DEPLOYMENT ================= */
        stage('Verify Deployment') {
            steps {
                withCredentials([[ $class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-devops-creds' ]]) {
                    sh """
                    aws eks update-kubeconfig --region $AWS_REGION --name stackly-cluster

                    echo "Pods:"
                    kubectl get pods -n stackly

                    echo "Services:"
                    kubectl get svc -n stackly

                    echo "Rollout status:"
                    kubectl rollout status deployment/frontend -n stackly
                    kubectl rollout status deployment/backend -n stackly
                    """
                }
            }
        }
    }

    /* ================= POST ACTION ================= */
    post {
        success {
            echo "SUCCESS: Application deployed to EKS with AWS RDS backend"
        }
        failure {
            echo "FAILED: Check Jenkins logs"
        }
    }
}