import React, { useState, useRef } from 'react';
import { Camera, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface HealthAnalysis {
  status: 'healthy' | 'warning' | 'critical';
  issues: string[];
  recommendations: string[];
  confidence: number;
}

export default function PlantHealthScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [analysis, setAnalysis] = useState<HealthAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      setError('Could not access camera. Please ensure you have granted camera permissions.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current) return;

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0);
      analyzeImage(canvas.toDataURL('image/jpeg'));
    }
  };

  const analyzeImage = async (imageData: string) => {
    setIsScanning(true);
    setError(null);

    try {
      // In a real app, this would call an AI service
      // For now, we'll simulate an analysis
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockAnalysis: HealthAnalysis = {
        status: 'healthy',
        issues: [],
        recommendations: ['Continue current care routine'],
        confidence: 0.95
      };

      setAnalysis(mockAnalysis);
    } catch (err) {
      setError('Failed to analyze image. Please try again.');
    } finally {
      setIsScanning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-600';
      case 'warning':
        return 'text-yellow-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Plant Health Scanner</h2>
        <Camera className="w-6 h-6 text-green-600" />
      </div>

      <div className="space-y-4">
        {!streamRef.current ? (
          <button
            onClick={startCamera}
            className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Start Camera
          </button>
        ) : (
          <div className="space-y-4">
            <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {isScanning && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent mb-2"></div>
                    <p>Analyzing plant health...</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <button
                onClick={captureImage}
                disabled={isScanning}
                className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Scan Plant
              </button>
              <button
                onClick={stopCamera}
                className="py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Stop Camera
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md">
            <AlertTriangle className="w-5 h-5 inline-block mr-2" />
            {error}
          </div>
        )}

        {analysis && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className={`p-4 rounded-md ${
              analysis.status === 'healthy' ? 'bg-green-50' :
              analysis.status === 'warning' ? 'bg-yellow-50' : 'bg-red-50'
            }`}>
              <div className="flex items-center">
                {analysis.status === 'healthy' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 mr-2" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                )}
                <h3 className={`font-semibold ${getStatusColor(analysis.status)}`}>
                  Plant Status: {analysis.status.charAt(0).toUpperCase() + analysis.status.slice(1)}
                </h3>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Confidence: {(analysis.confidence * 100).toFixed(1)}%
              </p>
            </div>

            {analysis.issues.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Issues Detected:</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-600">
                  {analysis.issues.map((issue, index) => (
                    <li key={index}>{issue}</li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h4 className="font-semibold mb-2">Recommendations:</h4>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
