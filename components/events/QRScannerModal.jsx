import { useState, useEffect, useRef } from "react";
import { BrowserMultiFormatReader } from "@zxing/library";
import { X, QrCode, Check, RefreshCw, AlertCircle, Camera } from "lucide-react";
import axios from "axios";
import { API_ENDPOINTS } from "@/utils/config";

const QRScannerModal = ({ onClose, eventName }) => {
  const [qrData, setQrData] = useState("");
  const [selection, setSelection] = useState("checkin"); // 'checkin' | 'snacks'
  const [scanning, setScanning] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const videoRef = useRef(null);
  const codeReader = useRef(null);

  useEffect(() => {
    if (scanning) {
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
      codeReader.current = new BrowserMultiFormatReader();
      codeReader.current.decodeFromVideoDevice(
        null,
        videoRef.current,
        (result, err) => {
          if (result) {
            setQrData(result.getText());
            setScanning(false);
          }
        }
      );
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
      setError(null);
      setSuccessMsg(null);

      const parsedData = JSON.parse(qrData);
      const { slug, email } = parsedData;

      if (!slug || !email) {
        throw new Error("Invalid badge QR code: missing event slug or attendee email");
      }

      let response;
      if (selection === "checkin") {
        response = await axios.post(API_ENDPOINTS.EVENTS.CHECKIN, { slug, email });
      } else if (selection === "snacks") {
        response = await axios.post(API_ENDPOINTS.EVENTS.SNACKS, { slug, email });
      }

      setSuccessMsg(response?.data?.message || `Successfully marked ${selection}!`);
      setTimeout(() => {
        setQrData("");
        setSuccessMsg(null);
        setScanning(true);
      }, 1500);
    } catch (err) {
      console.error("Error processing QR check-in:", err);
      setError(err.response?.data?.error || err.message || "Failed to process check-in");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-2xl w-full max-w-md p-6 relative text-zinc-900 dark:text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-zinc-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold">QR Attendance Scanner</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{eventName || "Event check-in"}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {scanning ? (
          <div className="space-y-3">
            <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-zinc-950 border-2 border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
              <video ref={videoRef} className="w-full h-full object-cover" />
              <div className="absolute inset-4 border-2 border-blue-500/60 rounded-lg pointer-events-none animate-pulse" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-500" />
                <span>Point camera at attendee badge</span>
              </p>
              <p className="text-[11px] text-zinc-400">
                Grant camera permissions if requested by the browser
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Scanned result card */}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800/60 rounded-xl border border-zinc-200 dark:border-zinc-700 font-mono text-xs overflow-x-auto text-zinc-800 dark:text-zinc-200">
              <p className="text-[10px] text-zinc-400 font-sans uppercase tracking-wider mb-1">Badge Payload</p>
              <pre className="text-[11px]">{qrData}</pre>
            </div>

            {error && (
              <div className="p-2.5 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-xl text-red-600 dark:text-red-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900 rounded-xl text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* Mode selection pills */}
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">
                Action to record:
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelection("checkin")}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all active:scale-[0.98] ${
                    selection === "checkin"
                      ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                      : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  Door Check-in
                </button>
                <button
                  type="button"
                  onClick={() => setSelection("snacks")}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all active:scale-[0.98] ${
                    selection === "snacks"
                      ? "bg-amber-600 text-white border-amber-600 shadow-xs"
                      : "bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-200 dark:border-zinc-700"
                  }`}
                >
                  Issue Snacks
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setQrData("");
                  setError(null);
                  setScanning(true);
                }}
                className="flex-1 py-2 rounded-xl text-xs font-medium border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors active:scale-[0.98]"
              >
                Scan Again
              </button>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition-all active:scale-[0.98] disabled:opacity-50"
              >
                {isSaving ? "Recording..." : "Confirm & Save"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QRScannerModal;
