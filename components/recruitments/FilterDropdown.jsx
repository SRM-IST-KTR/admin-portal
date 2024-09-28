import { useState } from "react";

const FilterDropdown = ({ onFilterChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        Technical: false,
        Creatives: false,
        Corporate: false,
        taskShortlisted: false,
        interviewShortlisted: false,
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
                <div className=" right-0 mt-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg text-black">
                    <div className="p-2">
                        {Object.keys(filters).map((filterName) => (
                            <div key={filterName} className="flex items-center mt-2 text-black">
                                <input
                                    type="checkbox"
                                    name={filterName}
                                    checked={filters[filterName]}
                                    onChange={handleFilterChange}
                                    id={filterName}
                                />
                                <label htmlFor={filterName} className="ml-2 text-black">
                                    {filterName}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
