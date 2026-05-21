pipeline {
    agent any

    environment {
        AWS_ACCOUNT_ID = "960862432033"
        AWS_REGION     = "ap-south-1"

        FRONTEND_REPO = "960862432033.dkr.ecr.ap-south-1.amazonaws.com/frontend"
        BACKEND_REPO  = "960862432033.dkr.ecr.ap-south-1.amazonaws.com/backend"
        NAMESPACE     = "stackly"
    }

    stages {

        /* ================= TAG ================= */
        stage('Set Image Tag') {
            steps {
                script {
                    env.IMAGE_TAG = sh(script: "git rev-parse --short HEAD", returnStdout: true).trim()
                }
            }
        }

        /* ================= VERIFY ================= */
        stage('Verify Files') {
            steps {
                sh 'ls -la'
            }
        }

        /* ================= ECR LOGIN ================= */
        stage('Login to AWS ECR') {
            steps {
                withCredentials([[ $class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-devops-creds' ]]) {
                    sh """
                    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com
                    """
                }
            }
        }

        /* ================= BUILD ================= */
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

        /* ================= PUSH ================= */
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

        /* ================= MYSQL FIX (IMPORTANT) ================= */
        stage('Deploy MySQL') {
            steps {
                withCredentials([[ $class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-devops-creds' ]]) {
                    sh """
                    aws eks update-kubeconfig --region $AWS_REGION --name stackly-cluster

                    # Create namespace safely
                    kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

                    #  IMPORTANT FIX: reset MySQL state (PVC issue fix)
                    kubectl delete deployment mysql -n $NAMESPACE --ignore-not-found
                    kubectl delete pvc mysql-pvc -n $NAMESPACE --ignore-not-found

                    # Apply MySQL manifests fresh
                    kubectl apply -f k8s/mysql/ -n $NAMESPACE

                    # Wait for MySQL properly
                    kubectl wait --for=condition=available deployment/mysql -n $NAMESPACE --timeout=300s
                    """
                }
            }
        }

        /* ================= APP DEPLOY ================= */
        stage('Apply App Manifests') {
            steps {
                withCredentials([[ $class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-devops-creds' ]]) {
                    sh """
                    aws eks update-kubeconfig --region $AWS_REGION --name stackly-cluster

                    kubectl apply -f k8s/backend-deployment.yaml -n $NAMESPACE
                    kubectl apply -f k8s/frontend-deployment.yaml -n $NAMESPACE

                    kubectl apply -f k8s/backend-service.yaml -n $NAMESPACE
                    kubectl apply -f k8s/frontend-service.yaml -n $NAMESPACE
                    """
                }
            }
        }

        /* ================= UPDATE IMAGES ================= */
        stage('Update Deployment Images') {
            steps {
                withCredentials([[ $class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-devops-creds' ]]) {
                    sh """
                    aws eks update-kubeconfig --region $AWS_REGION --name stackly-cluster

                    kubectl set image deployment/frontend frontend=$FRONTEND_REPO:$IMAGE_TAG -n $NAMESPACE
                    kubectl set image deployment/backend backend=$BACKEND_REPO:$IMAGE_TAG -n $NAMESPACE
                    """
                }
            }
        }

        /* ================= VERIFY ================= */
        stage('Verify Deployment') {
            steps {
                withCredentials([[ $class: 'AmazonWebServicesCredentialsBinding', credentialsId: 'aws-devops-creds' ]]) {
                    sh """
                    aws eks update-kubeconfig --region $AWS_REGION --name stackly-cluster

                    kubectl get pods -n $NAMESPACE
                    kubectl get svc -n $NAMESPACE

                    kubectl rollout status deployment/frontend -n $NAMESPACE --timeout=300s
                    kubectl rollout status deployment/backend -n $NAMESPACE --timeout=300s
                    """
                }
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