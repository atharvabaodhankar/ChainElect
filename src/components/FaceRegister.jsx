import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

const FaceRegister = ({ onFaceDetected, onError }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [isCapturing, setIsCapturing] = useState(false);
  const [message, setMessage] = useState('Loading face recognition models...');
  const [hasMultipleFaces, setHasMultipleFaces] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const detectionInterval = useRef(null);

  const stopContinuousDetection = () => {
    if (detectionInterval.current) {
      clearInterval(detectionInterval.current);
      detectionInterval.current = null;
    }
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        setMessage('Loading face recognition models...');
        
        // Load models sequentially to avoid memory issues
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        setMessage('Loading facial landmarks model...');
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        setMessage('Loading face recognition model...');
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        
        setMessage('Models loaded. Starting camera...');
        await startVideo();
      } catch (error) {
        console.error('Error loading models:', error);
        setMessage('Error loading face recognition models. Please refresh the page and try again.');
        onError('Failed to load face recognition models');
      }
    };

    loadModels();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
      stopContinuousDetection();
    };
  }, []);

  const startVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: "user"
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          setIsLoading(false);
          setMessage('Camera started. Please look at the camera and ensure good lighting.');
          // Start continuous face detection
          startContinuousDetection();
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setMessage('Error accessing camera. Please ensure camera permissions are granted.');
      onError('Failed to access camera');
    }
  };

  const startContinuousDetection = () => {
    // Clear any existing interval first
    stopContinuousDetection();

    detectionInterval.current = setInterval(async () => {
      if (!videoRef.current || isRegistered) {
        stopContinuousDetection();
        return;
      }
      
      try {
        const detections = await faceapi.detectAllFaces(videoRef.current);
        
        // Don't update UI if already registered
        if (!isRegistered) {
          if (detections.length > 1) {
            setHasMultipleFaces(true);
            setMessage('Multiple faces detected! Please ensure only one person is in the frame.');
            onError('Multiple faces detected');
          } else if (detections.length === 0) {
            setHasMultipleFaces(false);
            setMessage('No face detected. Please look at the camera.');
          } else {
            setHasMultipleFaces(false);
            setMessage('Single face detected. Ready to capture.');
          }
        }
      } catch (error) {
        console.error('Error during continuous detection:', error);
      }
    }, 1000);
  };

  const captureFace = async () => {
    if (isCapturing || !videoRef.current || hasMultipleFaces) return;

    setIsCapturing(true);
    setMessage('Detecting face...');

    try {
      // Get current face from video with multiple attempts
      let attempts = 0;
      const maxAttempts = 3;
      let detections = null;

      while (attempts < maxAttempts && !detections) {
        detections = await faceapi
          .detectSingleFace(videoRef.current)
          .withFaceLandmarks()
          .withFaceDescriptor();

        if (!detections) {
          setMessage(`No face detected. Please look directly at the camera. Attempt ${attempts + 1}/${maxAttempts}`);
          await new Promise(resolve => setTimeout(resolve, 1000));
          attempts++;
        }
      }

      if (!detections) {
        setMessage('Could not detect your face. Please ensure good lighting and look directly at the camera.');
        onError('Face detection failed');
        return;
      }

      // Stop continuous detection before proceeding with capture
      stopContinuousDetection();
      setIsRegistered(true);
      setHasMultipleFaces(false); // Reset multiple faces flag

      console.log('Face detected:', detections);
      setMessage('Face captured successfully!');

      // Get the video dimensions
      const videoEl = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoEl, 0, 0);

      // Convert canvas to blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg'));
      const imageFile = new File([blob], 'face-capture.jpg', { type: 'image/jpeg' });

      // Pass both the face descriptor and the captured image
      onFaceDetected({
        descriptor: Array.from(detections.descriptor),
        imageFile
      });

    } catch (error) {
      console.error('Error during face capture:', error);
      setMessage('Error during face capture. Please try again.');
      onError('Face capture failed');
      setIsRegistered(false); // Reset registered state on error
    } finally {
      setIsCapturing(false);
    }
  };

  return (
    <div className="face-auth-container">
      <div className="video-container">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          onPlay={() => {
            if (!isRegistered) {
              setMessage('Camera ready. Click "Capture Face" to proceed.');
            }
          }}
        />
        <canvas ref={canvasRef} />
      </div>
      <div className="face-auth-controls">
        <p className="face-auth-message">{message}</p>
        <button
          className="verify-face-button"
          onClick={captureFace}
          disabled={isLoading || isCapturing || hasMultipleFaces || isRegistered}
        >
          {isCapturing ? 'Capturing...' : 'Capture Face'}
        </button>
      </div>
    </div>
  );
};

export default FaceRegister;