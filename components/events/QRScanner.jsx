// components/events/QRScanner.js
import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";

const QRScanner = ({ onScan, onClose }) => {
  const [scanning, setScanning] = useState(true);
  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    if (scanning) {
      codeReader.current = new BrowserMultiFormatReader();
      startScanning();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [scanning]);

  const startScanning = () => {
    if (videoRef.current) {
      codeReader.current
        .decodeFromVideoDevice(null, videoRef.current, (result, err) => {
          if (result) {
            onScan(result.text);
            setScanning(false);
          } else if (err) {
            console.error("Error scanning QR code:", err);
          }
        })
        .catch((err) => console.error("Error starting scanning:", err));
    } else {
      console.error("Video reference is not set");
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>

        <div>
          <video ref={videoRef} className="w-full h-auto mb-4 rounded" />
          <p className="text-gray-600 text-center">Scanning for QR codes...</p>
          <p className="text-sm text-gray-400 text-center">
            Please ensure camera permissions are granted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
