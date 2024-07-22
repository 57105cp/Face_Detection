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
```bash
.
├── client
│   ├── Dockerfile
│   ├── package.json
│   ├── public
|   ├── src
|        ├── app.js
|        ├── index.js
│   
├── server
|   ├── docs
│   ├── Dockerfile
│   ├── index.js
|   ├── jsdoc.json
|   ├── swagger.json
│   ├── package.json
│   ├── src
│       ├── frameProcessor.js
│       └── modelLoader.js
│   
├── docker-compose.yml
└── README.md
```

## Docker Setup
  - sudo docker-compose down
  - sudo docker-compose build
  - sudo docker-compose up

## Access the Application
  - Frontend will be accessible at http://localhost:3000.
  - Backend runs on http://localhost:5000.
    
## Usage
  - Open the application in your browser at http://localhost:3000.
  - Click on "Start Video" to start the live video stream.
  - The application will start detecting faces in real-time and display the coordinates and landmarks of detected faces.
