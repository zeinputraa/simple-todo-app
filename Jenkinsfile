pipeline {
    agent any
    
    environment {
        APP_NAME = 'simple-todo-app'
        DOCKER_IMAGE = 'mobile-todo-app'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm: [
                    $class: 'GitSCM',
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: 'https://github.com/zeinputraa/simple-todo-app.git']]
                ]
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    try {
                        sh 'npm install'
                    } catch (error) {
                        echo "NPM install failed, trying with --force"
                        sh 'npm install --force --legacy-peer-deps'
                    }
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                script {
                    // Build Docker image
                    docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}")
                }
            }
        }
        
        stage('Stop Previous Containers') {
            steps {
                script {
                    // Stop and remove any existing containers
                    sh '''
                        docker-compose down || true
                        docker rm -f simple-todo-app || true
                    '''
                }
            }
        }
        
        stage('Deploy with Docker Compose') {
            steps {
                sh 'docker-compose up -d --build'
            }
        }
        
        stage('Health Check') {
            steps {
                script {
                    timeout(time: 5, unit: 'MINUTES') {
                        waitUntil {
                            try {
                                // Try multiple endpoints
                                def response1 = sh(
                                    script: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:19006 || echo "500"',
                                    returnStdout: true
                                ).trim()
                                
                                def response2 = sh(
                                    script: 'curl -s -o /dev/null -w "%{http_code}" http://localhost:19000 || echo "500"',
                                    returnStdout: true
                                ).trim()
                                
                                echo "Health check responses - 19006: ${response1}, 19000: ${response2}"
                                
                                // Consider success if any endpoint responds
                                return (response1 == "200" || response2 == "200")
                            } catch (Exception e) {
                                echo "Health check failed: ${e.message}"
                                sleep 30
                                return false
                            }
                        }
                    }
                }
            }
        }
        
        stage('Verify Containers') {
            steps {
                sh '''
                    echo "=== Running Containers ==="
                    docker ps
                    echo "=== Container Logs ==="
                    docker logs simple-todo-app || echo "No logs available yet"
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
            // Save workspace for debugging
            // cleanWs() // Comment dulu untuk debugging
        }
        success {
            echo '✅ Mobile App deployed successfully!'
            echo '📱 Access URLs:'
            echo '   - Metro Bundler: http://localhost:8081'
            echo '   - Expo DevTools: http://localhost:19002'
            echo '   - Web Version: http://localhost:19006'
            
            // Create build summary
            sh '''
                echo "## Build Summary" > build-summary.md
                echo "- Build: ${env.BUILD_ID}" >> build-summary.md
                echo "- Status: SUCCESS" >> build-summary.md
                echo "- Timestamp: $(date)" >> build-summary.md
                echo "" >> build-summary.md
                echo "### Access Points:" >> build-summary.md
                echo "- Web App: http://localhost:19006" >> build-summary.md
                echo "- Expo DevTools: http://localhost:19002" >> build-summary.md
                echo "- Metro Bundler: http://localhost:8081" >> build-summary.md
            '''
        }
        failure {
            echo '❌ Pipeline failed!'
            
            // Collect debug information
            sh '''
                echo "=== Debug Information ==="
                echo "Docker version:"
                docker --version
                echo "Node version:"
                node --version || echo "Node not available"
                echo "NPM version:"
                npm --version || echo "NPM not available"
                echo "Running containers:"
                docker ps -a
                echo "Docker images:"
                docker images
                echo "=== End Debug Info ==="
            '''
        }
    }
}