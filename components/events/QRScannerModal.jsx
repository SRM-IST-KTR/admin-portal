import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import axios from "axios";

const QRScannerModal = ({ onClose }) => {
  const [qrData, setQrData] = useState("");
  const [checkin, setCheckin] = useState(false);
  const [snacks, setSnacks] = useState(false);
  const [scanning, setScanning] = useState(true);

  const handleScan = (result) => {
    if (result && result.rawValue) {
      setQrData(result.rawValue);
      setScanning(false); // Stop scanning after successful scan
    }
  };

  const handleError = (error) => {
    console.error("QR Code scanning error:", error);
  };

  const handleSave = async () => {
    try {
      const { slug, email } = JSON.parse(qrData);

      if (checkin) {
        await axios.post("/api/v1/events/checkin", { slug, email });
      }

      if (snacks) {
        await axios.post("/api/v1/events/snacks", { slug, email });
      }

      setQrData("");
      setCheckin(false);
      setSnacks(false);
      setScanning(true);
    } catch (error) {
      console.error("Error saving QR data:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        {scanning ? (
          <div>
            <Scanner
              onScan={handleScan}
              onError={handleError}
              constraints={{ facingMode: "environment" }}
              formats={["qr_code"]}
              classNames={{
                container: "scanner-container",
                video: "scanner-video",
              }}
              styles={{
                container: { width: "100%", height: "auto" },
                video: { width: "100%", height: "auto" },
              }}
            />
            <p>Scanning for QR codes...</p>
          </div>
        ) : (
          <div>
            <p>QR Code Data: {qrData}</p>
            <label>
              <input
                type="radio"
                name="checkin"
                value={true}
                checked={checkin}
                onChange={() => setCheckin(!checkin)}
              />
              Check-in
            </label>
            <label>
              <input
                type="radio"
                name="snacks"
                value={true}
                checked={snacks}
                onChange={() => setSnacks(!snacks)}
              />
              Snacks
            </label>
            <button onClick={handleSave}>Save</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScannerModal;
