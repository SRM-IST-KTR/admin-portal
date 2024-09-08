// @/components/SearchBar.js
import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  return (
    <div className="mb-4">
      <input
        type="text"
        placeholder="Search by name, email, or registration number"
        value={query}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-lg p-2"
      />
    </div>
  );
};

export default SearchBar;
