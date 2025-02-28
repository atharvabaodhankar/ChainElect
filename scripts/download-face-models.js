import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const modelsDir = path.join(__dirname, '../public/models');

// Create models directory if it doesn't exist
if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

const modelFiles = [
  {
    name: 'face_landmark_68_model-shard1',
    url: 'https://github.com/justadudewhohacks/face-api.js/blob/master/weights/face_landmark_68_model-shard1?raw=true'
  },
  {
    name: 'face_landmark_68_model-weights_manifest.json',
    url: 'https://github.com/justadudewhohacks/face-api.js/blob/master/weights/face_landmark_68_model-weights_manifest.json?raw=true'
  },
  {
    name: 'face_recognition_model-shard1',
    url: 'https://github.com/justadudewhohacks/face-api.js/blob/master/weights/face_recognition_model-shard1?raw=true'
  },
  {
    name: 'face_recognition_model-weights_manifest.json',
    url: 'https://github.com/justadudewhohacks/face-api.js/blob/master/weights/face_recognition_model-weights_manifest.json?raw=true'
  },
  {
    name: 'ssd_mobilenetv1_model-shard1',
    url: 'https://github.com/justadudewhohacks/face-api.js/blob/master/weights/ssd_mobilenetv1_model-shard1?raw=true'
  },
  {
    name: 'ssd_mobilenetv1_model-shard2',
    url: 'https://github.com/justadudewhohacks/face-api.js/blob/master/weights/ssd_mobilenetv1_model-shard2?raw=true'
  },
  {
    name: 'ssd_mobilenetv1_model-weights_manifest.json',
    url: 'https://github.com/justadudewhohacks/face-api.js/blob/master/weights/ssd_mobilenetv1_model-weights_manifest.json?raw=true'
  }
];

const downloadFile = (url, filePath) => {
  return new Promise((resolve, reject) => {
    https.get(url, response => {
      if (response.statusCode === 302 || response.statusCode === 301) {
        // Handle redirect
        downloadFile(response.headers.location, filePath)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      fileStream.on('error', err => {
        fs.unlink(filePath, () => {});
        reject(err);
      });
    }).on('error', err => {
      reject(err);
    });
  });
};

const downloadModels = async () => {
  for (const file of modelFiles) {
    const filePath = path.join(modelsDir, file.name);
    try {
      await downloadFile(file.url, filePath);
      console.log(`Downloaded: ${file.name}`);
    } catch (error) {
      console.error(`Error downloading ${file.name}:`, error.message);
    }
  }
};

downloadModels(); 