import { createCanvas, loadImage } from 'canvas';
import * as tf from '@tensorflow/tfjs-node';

/**
 * Processes an image frame and detects faces.
 * @param {Buffer} buffer - The image buffer.
 * @param {Object} model - The face detection model.
 * @returns {Promise<{canvas: Canvas, faces: Array}>} The processed canvas and detected faces.
 */

export async function processFrame(buffer, model) {
  const img = await loadImage(buffer);
  const canvas = createCanvas(img.width, img.height);
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);

  const input = tf.browser.fromPixels(canvas);
  const faces = await model.estimateFaces(input, false);
  input.dispose();

  const categorizedFaces = faces.map(face => {
    const categorizedLandmarks = {
      right_eye: face.landmarks[0],
      left_eye: face.landmarks[1],
      nose: face.landmarks[2],
      mouth: face.landmarks[3],
      right_ear: face.landmarks[4],
      left_ear: face.landmarks[5],
    };

    return {
      topLeft: face.topLeft,
      bottomRight: face.bottomRight,
      landmarks: categorizedLandmarks,
      probability: face.probability
    };
  });

  faces.forEach(face => {
    const { topLeft, bottomRight, landmarks } = face;
    const [x1, y1] = topLeft;
    const [x2, y2] = bottomRight;
    // console.log("LANDMARKS: ", face);

    // Draw bounding box
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);

    // Draw keypoints
    landmarks.forEach(([x, y]) => {
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, 2 * Math.PI);
      ctx.fillStyle = 'green';
      ctx.fill();
    });
  });
  return { canvas, faces: categorizedFaces };
}


// +++++++++++++++++++++++++++++++++++++++++
// import { createCanvas, loadImage } from 'canvas';
// import * as tf from '@tensorflow/tfjs-node';

// export async function processFrame(buffer, model) {
//   const img = await loadImage(buffer);
//   const canvas = createCanvas(img.width, img.height);
//   const ctx = canvas.getContext('2d');
//   ctx.drawImage(img, 0, 0);

//   const input = tf.browser.fromPixels(canvas);
//   const faces = await model.estimateFaces(input, false);
//   input.dispose();

//   faces.forEach(face => {
//     const { topLeft, bottomRight } = face;
//     const [x1, y1] = topLeft;
//     const [x2, y2] = bottomRight;

//     ctx.strokeStyle = 'red';
//     ctx.lineWidth = 2;
//     ctx.strokeRect(x1, y1, x2 - x1, y2 - y1);
//   });

//   return canvas;
// }

