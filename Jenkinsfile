pipeline {
    agent any
    
    environment {
        APP_NAME = 'simple-todo-app'
        DOCKER_IMAGE = 'mobile-todo-app'
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                url: 'https://github.com/zeinputraa/simple-todo-app.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}")
                }
            }
        }
        
        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker-compose down || true'
                sh 'docker-compose up -d --build'
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    timeout(time: 2, unit: 'MINUTES') {
                        waitUntil {
                            try {
                                def response = sh(
                                    script: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:19006',
                                    returnStdout: true
                                ).trim()
                                echo "Health check response: ${response}"
                                return response == "200"
                            } catch (Exception e) {
                                echo "Health check failed: ${e.message}"
                                return false
                            }
                        }
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
            cleanWs()
        }
        success {
            echo '✅ Mobile App deployed successfully!'
            echo '📱 Access URLs:'
            echo '   - Metro Bundler: http://localhost:8081'
            echo '   - Expo DevTools: http://localhost:19002'
            echo '   - Web Version: http://localhost:19006'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}