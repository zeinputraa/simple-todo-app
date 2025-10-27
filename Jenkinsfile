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
                    docker.build("${DOCKER_IMAGE}:${env.BUILD_ID}")
                }
            }
        }
        
        stage('Stop Previous Containers') {
            steps {
                script {
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
        
        stage('Container Health Check') {
            steps {
                script {
                    timeout(time: 3, unit: 'MINUTES') {
                        waitUntil {
                            try {
                                // Check if container is running
                                def containerStatus = sh(
                                    script: 'docker inspect --format="{{.State.Status}}" simple-todo-app 2>/dev/null || echo "not-found"',
                                    returnStdout: true
                                ).trim()
                                
                                // Check if process is running inside container
                                def processCheck = sh(
                                    script: 'docker exec simple-todo-app ps aux 2>/dev/null | grep "node.*expo" || echo "not-running"',
                                    returnStdout: true
                                ).trim()
                                
                                echo "Container status: ${containerStatus}"
                                echo "Process check: ${processCheck}"
                                
                                // Consider healthy if container is running and process exists
                                return (containerStatus == "running" && processCheck != "not-running")
                            } catch (Exception e) {
                                echo "Health check in progress: ${e.message}"
                                sleep 10
                                return false
                            }
                        }
                    }
                }
            }
        }
        
        stage('Verify Deployment') {
            steps {
                sh '''
                    echo "=== Deployment Verification ==="
                    echo "1. Checking running containers:"
                    docker ps
                    echo ""
                    echo "2. Checking container logs:"
                    docker logs simple-todo-app --tail 20
                    echo ""
                    echo "3. Checking exposed ports:"
                    docker port simple-todo-app
                    echo ""
                    echo "4. Checking container health:"
                    docker inspect --format="State: {{.State.Status}}, Health: {{.State.Health.Status}}" simple-todo-app
                '''
            }
        }
    }
    
    post {
        always {
            echo 'Pipeline execution completed'
        }
        success {
            echo '✅ Mobile App deployed successfully!'
            echo '📱 Access URLs:'
            echo '   - Metro Bundler: http://localhost:8081'
            echo '   - Expo DevTools: http://localhost:19002' 
            echo '   - Web Version: http://localhost:19006'
            echo ''
            echo '🔧 To use the app:'
            echo '   1. Install "Expo Go" on your phone'
            echo '   2. Open http://localhost:19002 in browser'
            echo '   3. Scan the QR code with Expo Go app'
            
            sh '''
                echo "## 🎉 DEPLOYMENT SUCCESS" > build-success.md
                echo "" >> build-success.md
                echo "### 📱 Mobile App Details" >> build-success.md
                echo "- **Build ID**: ${env.BUILD_ID}" >> build-success.md
                echo "- **Container**: simple-todo-app" >> build-success.md
                echo "- **Status**: ✅ Running" >> build-success.md
                echo "" >> build-success.md
                echo "### 🌐 Access Points" >> build-success.md
                echo "- Metro Bundler: http://localhost:8081" >> build-success.md
                echo "- Expo DevTools: http://localhost:19002" >> build-success.md
                echo "- Web Version: http://localhost:19006" >> build-success.md
                echo "" >> build-success.md
                echo "### 📋 Usage Instructions" >> build-success.md
                echo "1. Install **Expo Go** app on your smartphone" >> build-success.md
                echo "2. Open http://localhost:19002 in your browser" >> build-success.md
                echo "3. Scan the QR code with Expo Go app" >> build-success.md
                echo "4. The Todo app will load on your phone" >> build-success.md
            '''
        }
        failure {
            echo '❌ Pipeline failed!'
            
            sh '''
                echo "=== DEBUG INFORMATION ==="
                echo "Docker System Info:"
                docker --version
                echo ""
                echo "All Containers:"
                docker ps -a
                echo ""
                echo "Container Logs:"
                docker logs simple-todo-app || echo "No logs available"
                echo ""
                echo "Docker Images:"
                docker images | head -10
                echo ""
                echo "Network Status:"
                docker network ls
                echo "=== END DEBUG INFO ==="
            '''
        }
    }
}