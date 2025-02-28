import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

// Adjust this value based on testing. 0.6 is slightly more lenient than 0.5
const FACE_MATCH_THRESHOLD = 0.65;

const FaceAuth = ({ storedImageUrl, onAuthSuccess, onAuthFailure }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState('Loading face recognition models...');

  useEffect(() => {
    const loadModels = async () => {
      try {
        setMessage('Loading face recognition models...');
        
        // Load models sequentially to avoid memory issues
        await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
        setMessage('Loading facial landmarks model...');
        await faceapi.nets.faceLandmark68Net  .loadFromUri(MODEL_URL);
        setMessage('Loading face recognition model...');
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
        
        setMessage('Models loaded. Starting camera...');
        await startVideo();
      } catch (error) {
        console.error('Error loading models:', error);
        setMessage('Error loading face recognition models. Please refresh the page and try again.');
        onAuthFailure();
      }
    };

    loadModels();
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach(track => track.stop());
      }
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
        };
      }
    } catch (error) {
      console.error('Error accessing camera:', error);
      setMessage('Error accessing camera. Please ensure camera permissions are granted.');
      onAuthFailure();
    }
  };

  const loadImage = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = (error) => reject(error);
      img.src = url;
    });
  };

  const compareFaces = async (face1, face2) => {
    try {
      const distance = faceapi.euclideanDistance(face1.descriptor, face2.descriptor);
      console.log('Face distance:', distance);
      console.log('Threshold:', FACE_MATCH_THRESHOLD);
      console.log('Match status:', distance < FACE_MATCH_THRESHOLD ? 'MATCH' : 'NO MATCH');
      return distance < FACE_MATCH_THRESHOLD;
    } catch (error) {
      console.error('Error comparing faces:', error);
      return false;
    }
  };

  const checkFace = async () => {
    if (isChecking || !videoRef.current || !storedImageUrl) return;

    setIsChecking(true);
    setMessage('Checking face...');

    try {
      // Load the stored profile image
      const storedImage = await loadImage(storedImageUrl);
      console.log('Stored image loaded');

      const storedDetection = await faceapi
        .detectSingleFace(storedImage)
        .withFaceLandmarks()
        .withFaceDescriptor();

      if (!storedDetection) {
        setMessage('No face detected in stored profile image. Please contact support.');
        setIsChecking(false);
        onAuthFailure();
        return;
      }

      console.log('Stored face detected:', storedDetection);

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
        setIsChecking(false);
        onAuthFailure();
        return;
      }

      console.log('Live face detected:', detections);

      // Compare faces
      const isMatch = await compareFaces(detections, storedDetection);
      console.log('Face match result:', isMatch);

      if (isMatch) {
        setMessage('Face verified successfully!');
        onAuthSuccess();
      } else {
        setMessage('Face verification failed. Please try again with better lighting and look directly at the camera.');
        onAuthFailure();
      }
    } catch (error) {
      console.error('Error during face check:', error);
      setMessage('Error during face verification. Please try again.');
      onAuthFailure();
    } finally {
      setIsChecking(false);
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
            setMessage('Camera ready. Click "Verify Face" to proceed.');
          }}
        />
        <canvas ref={canvasRef} />
      </div>
      <div className="face-auth-controls">
        <p className="face-auth-message">{message}</p>
        <button
          className="verify-face-button"
          onClick={checkFace}
          disabled={isLoading || isChecking}
        >
          {isChecking ? 'Verifying...' : 'Verify Face'}
        </button>
      </div>
    </div>
  );
};

export default FaceAuth; 