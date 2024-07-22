# Face Detection Project

This is a live video face detection project using React for the frontend, Node.js with TensorFlow.js for the backend, and Docker for containerization.

## Features

- Live video streaming from the webcam.
- Real-time face detection using TensorFlow.js.
- Display of detected face coordinates and landmarks.
- Dockerized setup for easy deployment.

## Prerequisites

- Docker and Docker Compose installed on your machine.
- Basic understanding of JavaScript, React, and Node.js.

## Getting Started

### Clone the Repository

```bash
git clone [https://github.com/your-username/face-detection-project.git](https://github.com/57105cp/Face_Detection.git)
cd face-detection-project
```

## Project Structure
.
├── front
│   ├── Dockerfile
│   ├── package.json
│   ├── public
│   ├── src
│   └── ... # other frontend files
├── server
│   ├── Dockerfile
│   ├── index.js
│   ├── package.json
│   ├── src
│   │   ├── frameProcessor.js
│   │   └── modelLoader.js
│   └── ... # other backend files
├── docker-compose.yml
└── README.md

## Docker Setup
sudo docker-compose down

# Rebuild Docker images
sudo docker-compose build

# Start Docker containers
sudo docker-compose up
