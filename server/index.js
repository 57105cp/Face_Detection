import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { loadModel } from './src/modelLoader.js';
import { processFrame } from './src/frameProcessor.js';
import swagger from 'swagger-ui-express';
import apiDocs from "./swagger.json" assert {type: 'json'};

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});
const port = 5000;

app.use('/docs', swagger.serve, swagger.setup(apiDocs));
app.use(cors());
app.use(express.static('public'));

let model;

/**
 * Handles client connections and processes video frames.
 */

io.on('connection', async (socket) => {
  console.log('Client connected');
  model = model || await loadModel();

    /**
   * Processes received video frame data.
   * @param {string} data - Base64-encoded image data.
   */

  socket.on('frame', async (data) => {
    // console.log("Video stream data: ", data.length);
    const buffer = Buffer.from(data.split(',')[1], 'base64');
    const { canvas, faces } = await processFrame(buffer, model);
    const frameDataUrl = canvas.toDataURL('image/png');
    // console.log("frameDataUrl : ", frameDataUrl.length);
    socket.emit('processedFrame', { frameDataUrl, faces });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
