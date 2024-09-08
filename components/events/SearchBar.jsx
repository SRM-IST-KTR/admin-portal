// components/events/SearchBar.js
import { useState } from "react";
import QRScanner from "@/components/events/QRScanner";

const SearchBar = ({ onSearch, onScan }) => {
  const [query, setQuery] = useState("");
  const [showQRScanner, setShowQRScanner] = useState(false);

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleOpenQRScanner = () => {
    setShowQRScanner(true);
  };

  const handleCloseQRScanner = () => {
    setShowQRScanner(false);
  };

  const handleQrData = (qrData) => {
    try {
      const { email } = JSON.parse(qrData);
      onScan(email);
    } catch (error) {
      console.error("Invalid QR data:", error);
    }
    handleCloseQRScanner();
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name, email, or registration number"
          value={query}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-lg p-2"
        />
        <button
          onClick={handleOpenQRScanner}
          className="mt-2 bg-blue-500 text-white px-2 py-2 rounded-lg"
        >
          Search Using QR
        </button>
      </div>

      {showQRScanner && (
        <QRScanner onScan={handleQrData} onClose={handleCloseQRScanner} />
      )}
    </div>
  );
};

export default SearchBar;
