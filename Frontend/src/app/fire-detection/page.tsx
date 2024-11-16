'use client'

import { useEffect, useRef, useState } from 'react';
import type { NextPage, NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

interface Prediction {
  class: string;
  confidence: number;
}

interface ApiResponse {
  predictions: Prediction[];
}

export async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const response = await axios({
      method: "POST",
      url: "https://detect.roboflow.com/fire-vc4nw/3",
      params: {
        api_key: "D0PwkQDgic4M3VCrGM8W"
      },
      data: req.body.image,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Error processing request' });
  }
}

const FireDetection: NextPage = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isFireDetected, setIsFireDetected] = useState(false);

  const confidenceThreshold = 0.7;

  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Error accessing the camera: ", err);
      }
    };

    initCamera();

    const captureAndDetectFire = async () => {
      if (!canvasRef.current || !videoRef.current) return;

      const context = canvasRef.current.getContext('2d');
      if (!context) return;

      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const imageData = canvasRef.current.toDataURL('image/jpeg').split(',')[1];

      try {
        const response = await axios<ApiResponse>({
          method: "POST",
          url: "https://detect.roboflow.com/fire-vc4nw/3",
          params: {
            api_key: "t2Fw98AlpW5ldaQu55sj"
          },
          data: imageData,
          headers: {
            "Content-Type": "application/x-www-form-urlencoded"
          }
        });

        const fireDetected = response.data.predictions.some(
          prediction => prediction.class === 'fire' && prediction.confidence >= confidenceThreshold
        );

        setIsFireDetected(fireDetected);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    const interval = setInterval(captureAndDetectFire, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <h1>Fire Detection Demo</h1>
      <video
        ref={videoRef}
        width={640}
        height={480}
        autoPlay
        playsInline
      />
      <canvas
        ref={canvasRef}
        width={640}
        height={480}
        className="hidden"
      />
      {isFireDetected && (
        <div className="alert">🔥 Fire Detected!</div>
      )}

      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2rem;
          min-height: 100vh;
          background: #f5f5f5;
        }
        .hidden {
          display: none;
        }
        .alert {
          margin-top: 1rem;
          padding: 1rem 2rem;
          background-color: #ff4444;
          color: white;
          border-radius: 4px;
          font-weight: bold;
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        h1 {
          color: #333;
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
};

export default FireDetection;