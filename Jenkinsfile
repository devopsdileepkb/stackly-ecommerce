pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "960862432033"
        AWS_REGION     = "ap-south-1"

        FRONTEND_REPO = "960862432033.dkr.ecr.ap-south-1.amazonaws.com/frontend"
        BACKEND_REPO  = "960862432033.dkr.ecr.ap-south-1.amazonaws.com/backend"
    }

    stages {

        stage('Set Image Tag') {
            steps {
                script {
                    env.IMAGE_TAG = sh(
                        script: "git rev-parse --short HEAD",
                        returnStdout: true
                    ).trim()
                }
            }
        }

        stage('Verify Files') {
            steps {
                sh 'ls -la'
            }
        }

        stage('Login to AWS ECR') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-devops-creds'
                ]]) {
                    sh """
                    aws ecr get-login-password --region $AWS_REGION | \
                    docker login --username AWS --password-stdin \
                    ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    """
                }
            }
        }

        stage('Build & Tag Images') {
            parallel {

                stage('Frontend') {
                    steps {
                        sh """
                        docker build -t frontend ./frontend
                        docker tag frontend:latest $FRONTEND_REPO:$IMAGE_TAG
                        docker tag frontend:latest $FRONTEND_REPO:latest
                        """
                    }
                }

                stage('Backend') {
                    steps {
                        sh """
                        docker build -t backend ./backend
                        docker tag backend:latest $BACKEND_REPO:$IMAGE_TAG
                        docker tag backend:latest $BACKEND_REPO:latest
                        """
                    }
                }
            }
        }

        stage('Push Images') {
            parallel {

                stage('Frontend Push') {
                    steps {
                        sh """
                        docker push $FRONTEND_REPO:$IMAGE_TAG
                        docker push $FRONTEND_REPO:latest
                        """
                    }
                }

                stage('Backend Push') {
                    steps {
                        sh """
                        docker push $BACKEND_REPO:$IMAGE_TAG
                        docker push $BACKEND_REPO:latest
                        """
                    }
                }
            }
        }

        stage('Apply Kubernetes Manifests') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-devops-creds'
                ]]) {

                    sh """                
                    aws eks update-kubeconfig --region ap-south-1 --name stackly-cluster

                    kubectl apply -f k8s/frontend-deployment.yaml -n stackly
                    kubectl apply -f k8s/backend-deployment.yaml -n stackly
                    kubectl apply -f k8s/frontend-service.yaml -n stackly
                    kubectl apply -f k8s/backend-service.yaml -n stackly
                    """
                }
            }
        }

        stage('Update Kubernetes Deployment') {
            steps {
                withCredentials([[
                    $class: 'AmazonWebServicesCredentialsBinding',
                    credentialsId: 'aws-devops-creds'
                ]]) {

                    sh """                    
                    aws eks update-kubeconfig --region ap-south-1 --name stackly-cluster

                    kubectl set image deployment/frontend \                    
                    frontend=960862432033.dkr.ecr.ap-south-1.amazonaws.com/frontend:$IMAGE_TAG -n stackly

                    kubectl set image deployment/backend \                    
                    backend=960862432033.dkr.ecr.ap-south-1.amazonaws.com/backend:$IMAGE_TAG -n stackly
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {

                sh 'kubectl get pods -n stackly'
                sh 'kubectl get svc -n stackly'

                sh 'kubectl rollout status deployment/frontend -n stackly'
                sh 'kubectl rollout status deployment/backend -n stackly'
            }
        }
    }

    post {

        success {
            echo 'Application deployed successfully to EKS'
        }

        failure {
            echo 'Pipeline failed — check logs for details'
        }
    }
}