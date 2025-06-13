pipeline {
    agent any

    environment {
        DOCKER_REGISTRY = "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com" // Replace ACCOUNT_ID
        BACKEND_IMAGE_NAME = "online-grocery-backend"
        FRONTEND_IMAGE_NAME = "online-grocery-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo/fullstack-grocery.git'
            }
        }
        
        stage('Build & Push Backend Image') {
            steps {
                dir('grocery-app-backend') {
                    script {
                        def imageTag = "${env.BUILD_NUMBER}"
                        sh "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${DOCKER_REGISTRY}"
                        docker.build("${DOCKER_REGISTRY}/${BACKEND_IMAGE_NAME}:${imageTag}")
                        docker.push("${DOCKER_REGISTRY}/${BACKEND_IMAGE_NAME}:${imageTag}")
                    }
                }
            }
        }

        stage('Build & Push Frontend Image') {
            steps {
                dir('grocery-app-frontend') {
                    script {
                        def imageTag = "${env.BUILD_NUMBER}"
                        sh "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${DOCKER_REGISTRY}"
                        docker.build("${DOCKER_REGISTRY}/${FRONTEND_IMAGE_NAME}:${imageTag}")
                        docker.push("${DOCKER_REGISTRY}/${FRONTEND_IMAGE_NAME}:${imageTag}")
                    }
                }
            }
        }

        stage('Approve & Deploy to Production') {
            input message: 'Deploy to PRODUCTION environment?', submitter: 'release-manager'
            steps {
                echo "Deploying to Production environment..."
                ansiblePlaybook(
                    playbook: 'ansible/deploy.yml',
                    extraVars: [
                        k8s_namespace: 'prod',
                        image_tag: env.BUILD_NUMBER
                    ]
                )
            }
        }
    }
}
