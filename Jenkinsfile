pipeline {
    agent any

    environment {
        SONAR_HOST_URL = "http://your-sonarqube-server:9000"
        SONAR_LOGIN_TOKEN = credentials('SONAR_TOKEN')
        DOCKER_REGISTRY = "ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com" // Replace ACCOUNT_ID
        DOCKER_IMAGE_NAME = "online-grocery-app"
        APP_DB_PASSWORD = credentials('PROD_DB_PASSWORD') // Example of a secret
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/your-repo/online-grocery.git'
            }
        }

        stage('Build') {
            steps {
                sh 'mvn clean install'
            }
        }

        stage('Code Analysis') {
            steps {
                withSonarQubeEnv('MySonarQubeServer') {
                    sh 'mvn sonar:sonar'
                }
            }
        }
        
        stage('Quality Gate') {
            steps {
                timeout(time: 1, unit: 'HOURS') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build & Push Docker Image') {
            steps {
                script {
                    def imageTag = "${env.BUILD_NUMBER}"
                    // Login to AWS ECR and push the image
                    sh "aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ${DOCKER_REGISTRY}"
                    docker.build("${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${imageTag}")
                    docker.push("${DOCKER_REGISTRY}/${DOCKER_IMAGE_NAME}:${imageTag}")
                }
            }
        }

        stage('Deploy to Dev') {
            steps {
                echo "Deploying to Development environment..."
                ansiblePlaybook(
                    playbook: 'ansible/deploy.yml',
                    extraVars: [
                        k8s_namespace: 'dev',
                        image_tag: env.BUILD_NUMBER,
                        db_user: 'dev_user',
                        db_password_b64: APP_DB_PASSWORD.bytes.encodeBase64().toString()
                    ]
                )
            }
        }
        
        stage('Approve for QA') {
            steps {
                input message: 'Deploy to QA environment?', submitter: 'qa-team,release-manager'
            }
        }

        stage('Deploy to QA') {
            steps {
                echo "Deploying to QA environment..."
                ansiblePlaybook(
                    playbook: 'ansible/deploy.yml',
                    extraVars: [
                        k8s_namespace: 'qa',
                        image_tag: env.BUILD_NUMBER,
                        db_user: 'qa_user',
                        db_password_b64: APP_DB_PASSWORD.bytes.encodeBase64().toString()
                    ]
                )
            }
        }

        stage('Approve for Production') {
            steps {
                input message: 'Deploy to PRODUCTION environment?', submitter: 'release-manager'
            }
        }

        stage('Deploy to Production') {
            steps {
                echo "Deploying to Production environment..."
                ansiblePlaybook(
                    playbook: 'ansible/deploy.yml',
                    extraVars: [
                        k8s_namespace: 'prod',
                        image_tag: env.BUILD_NUMBER,
                        db_user: 'prod_user',
                        db_password_b64: APP_DB_PASSWORD.bytes.encodeBase64().toString()
                    ]
                )
            }
        }
    }
}
