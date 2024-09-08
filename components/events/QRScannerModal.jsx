import React, { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import axios from "axios";

const QRScannerModal = ({ onClose }) => {
  const [qrData, setQrData] = useState("");
  const [selection, setSelection] = useState("");
  const [scanning, setScanning] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
            setQrData(result.text);
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

  const handleSave = async () => {
    try {
      setIsSaving(true);
      const { slug, email } = JSON.parse(qrData);

      if (selection === "checkin") {
        await axios.post("/api/v1/events/checkin", { slug, email });
      } else if (selection === "snacks") {
        await axios.post("/api/v1/events/snacks", { slug, email });
      }

      setQrData("");
      setSelection("");
      setScanning(true);
    } catch (error) {
      console.error("Error saving QR data:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-800 bg-opacity-75">
      <div className="bg-white p-6 rounded-lg shadow-lg relative max-w-md w-full">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold"
          onClick={onClose}
          disabled={isSaving}
        >
          &times;
        </button>

        {scanning ? (
          <div>
            <video ref={videoRef} className="w-full h-auto mb-4 rounded" />
            <p className="text-gray-600 text-center">
              Scanning for QR codes...
            </p>
            <p className="text-sm text-gray-400 text-center">
              Please ensure camera permissions are granted.
            </p>
          </div>
        ) : (
          <div>
            <p className="text-gray-800 font-semibold text-lg mb-4">
              QR Code Data:
            </p>
            <pre className="bg-gray-100 p-2 rounded text-sm text-gray-800 overflow-x-auto mb-4">
              {JSON.stringify(JSON.parse(qrData), null, 2)}
            </pre>

            <div className="flex flex-col space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="selection"
                  value="checkin"
                  checked={selection === "checkin"}
                  onChange={() => setSelection("checkin")}
                  className="form-radio text-blue-500"
                  disabled={isSaving}
                />
                <span className="ml-2 text-gray-700">Check-in</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="selection"
                  value="snacks"
                  checked={selection === "snacks"}
                  onChange={() => setSelection("snacks")}
                  className="form-radio text-blue-500"
                  disabled={isSaving}
                />
                <span className="ml-2 text-gray-700">Snacks</span>
              </label>
            </div>

            <button
              onClick={handleSave}
              className={`mt-6 w-full py-2 rounded-lg transition ${
                isSaving
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white`}
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScannerModal;
