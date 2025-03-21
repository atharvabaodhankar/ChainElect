import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';

const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';

// Adjust this value based on testing. 0.6 is slightly more lenient than 0.5
const FACE_MATCH_THRESHOLD = 0.45;

const FaceAuth = ({ storedImageUrl, onAuthSuccess, onAuthFailure, storedFaceDescriptor }) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [message, setMessage] = useState('Loading face recognition models...');
  const [hasMultipleFaces, setHasMultipleFaces] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
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
        onAuthFailure();
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
      onAuthFailure();
    }
  };

  const startContinuousDetection = () => {
    // Clear any existing interval first
    stopContinuousDetection();

    detectionInterval.current = setInterval(async () => {
      if (!videoRef.current || isVerified) {
        stopContinuousDetection();
        return;
      }
      
      try {
        const detections = await faceapi.detectAllFaces(videoRef.current);
        
        // Don't update UI if already verified
        if (!isVerified) {
          if (detections.length > 1) {
            setHasMultipleFaces(true);
            setMessage('Multiple faces detected! Please ensure only one person is in the frame.');
            onAuthFailure();
          } else if (detections.length === 0) {
            setHasMultipleFaces(false);
            setMessage('No face detected. Please look at the camera.');
          } else {
            setHasMultipleFaces(false);
            setMessage('Single face detected. Ready to verify.');
          }
        }
      } catch (error) {
        console.error('Error during continuous detection:', error);
      }
    }, 1000);
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

  const checkFace = async () => {
    if (isChecking || !videoRef.current || hasMultipleFaces) return;

    setIsChecking(true);
    setMessage('Checking face...');

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
        setIsChecking(false);
        onAuthFailure();
        return;
      }

      // Stop continuous detection before proceeding with verification
      stopContinuousDetection();
      setHasMultipleFaces(false); // Reset multiple faces flag

      console.log('Live face detected:', detections);

      // Create a Float32Array from the stored descriptor
      const storedDescriptor = new Float32Array(storedFaceDescriptor);

      // Compare faces using the stored descriptor
      const distance = faceapi.euclideanDistance(detections.descriptor, storedDescriptor);
      console.log('Face distance:', distance);
      console.log('Threshold:', FACE_MATCH_THRESHOLD);
      const isMatch = distance < FACE_MATCH_THRESHOLD;
      console.log('Match status:', isMatch ? 'MATCH' : 'NO MATCH');

      if (isMatch) {
        setMessage('Face verified successfully!');
        setIsVerified(true);
        onAuthSuccess();
      } else {
        setMessage('Face verification failed. Please try again with better lighting and look directly at the camera.');
        onAuthFailure();
        // Restart continuous detection on failure
        startContinuousDetection();
      }
    } catch (error) {
      console.error('Error during face check:', error);
      setMessage('Error during face verification. Please try again.');
      onAuthFailure();
      // Restart continuous detection on error
      startContinuousDetection();
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
            if (!isVerified) {
              setMessage('Camera ready. Click "Verify Face" to proceed.');
            }
          }}
        />
        <canvas ref={canvasRef} />
      </div>
      <div className="face-auth-controls">
        <p className="face-auth-message">{message}</p>
        <button
          className="verify-face-button"
          onClick={checkFace}
          disabled={isLoading || isChecking || hasMultipleFaces || isVerified}
        >
          {isChecking ? 'Verifying...' : 'Verify Face'}
        </button>
      </div>
    </div>
  );
};

export default FaceAuth;