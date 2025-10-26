import { Filter, X } from 'lucide-react';

const POSITIONS = ['President', 'Vice President', 'Director', 'Member', 'Lead', 'Associate', 'Admin', 'Alumni'];
const DOMAINS = ['President', 'Vice President', 'Technical', 'Corporate', 'Creatives'];

export default function FilterBar({ filters, onFilterChange, onClearFilters }) {
    const hasActiveFilters = filters.domain || filters.position;

    return (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 text-gray-700 font-medium">
                    <Filter className="w-4 h-4" />
                    <span>Filters:</span>
                </div>

                <div className="flex flex-wrap gap-3 flex-grow">
                    {/* Domain Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Domain:</label>
                        <select
                            value={filters.domain}
                            onChange={(e) => onFilterChange('domain', e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Domains</option>
                            {DOMAINS.map((domain) => (
                                <option key={domain} value={domain}>
                                    {domain}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Position Filter */}
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Position:</label>
                        <select
                            value={filters.position}
                            onChange={(e) => onFilterChange('position', e.target.value)}
                            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="">All Positions</option>
                            {POSITIONS.map((position) => (
                                <option key={position} value={position}>
                                    {position}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Clear Filters Button */}
                {hasActiveFilters && (
                    <button
                        onClick={onClearFilters}
                        className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 px-3 py-1.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <X className="w-4 h-4" />
                        Clear Filters
                    </button>
                )}
            </div>

            {/* Active Filters Display */}
            {hasActiveFilters && (
                <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-gray-500">Active filters:</span>
                    {filters.domain && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Domain: {filters.domain}
                            <button
                                onClick={() => onFilterChange('domain', '')}
                                className="hover:bg-blue-200 rounded-full p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                    {filters.position && (
                        <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                            Position: {filters.position}
                            <button
                                onClick={() => onFilterChange('position', '')}
                                className="hover:bg-blue-200 rounded-full p-0.5"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
