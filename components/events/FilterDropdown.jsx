// @/components/events/FilterDropdown.js
import { useState } from "react";

const FilterDropdown = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    rsvp: false,
    checkin: false,
    snacks: false,
  });

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: checked };
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className=" inline-block text-left">
      <button
        type="button"
        className="bg-gray-500 text-white px-4 py-2 rounded-lg"
        aria-haspopup="true"
        onClick={toggleDropdown}
      >
        Filter
      </button>
      {isOpen && (
        <div className=" right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="p-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="rsvp"
                checked={filters.rsvp}
                onChange={handleFilterChange}
                id="rsvp"
              />
              <label htmlFor="rsvp" className="ml-2">
                RSVP
              </label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="checkin"
                checked={filters.checkin}
                onChange={handleFilterChange}
                id="checkin"
              />
              <label htmlFor="checkin" className="ml-2">
                Check-in
              </label>
            </div>
            <div className="flex items-center mt-2">
              <input
                type="checkbox"
                name="snacks"
                checked={filters.snacks}
                onChange={handleFilterChange}
                id="snacks"
              />
              <label htmlFor="snacks" className="ml-2">
                Snacks
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
