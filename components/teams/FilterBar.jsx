import { Search, X, Filter, Sparkles } from 'lucide-react';

const POSITIONS = ['President', 'Vice President', 'Director', 'Lead', 'Associate', 'Member', 'Admin', 'Alumni'];
const DOMAINS = ['Technical', 'Creatives', 'Corporate', 'Leadership'];

export default function FilterBar({
    searchQuery,
    onSearchChange,
    selectedDomain,
    onDomainChange,
    selectedPosition,
    onPositionChange,
    onClearAll,
    domainCounts = {},
    totalCount = 0,
}) {
    const hasActiveFilters = Boolean(searchQuery.trim() || selectedDomain || selectedPosition);

    return (
        <div className="mb-6 space-y-3">
            {/* Search Input + Position Selector */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="relative flex-grow">
                    <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        placeholder="Search members by name, position, domain, caption, or handle..."
                        className="w-full text-xs sm:text-sm pl-9 pr-9 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 shadow-xs transition-colors"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => onSearchChange('')}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 rounded-md transition-colors"
                            aria-label="Clear search"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    )}
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    <div className="relative">
                        <select
                            value={selectedPosition}
                            onChange={(e) => onPositionChange(e.target.value)}
                            className="text-xs sm:text-sm appearance-none bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl pl-3 pr-8 py-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-700 dark:text-zinc-200 shadow-xs cursor-pointer transition-colors"
                        >
                            <option value="">All Positions</option>
                            {POSITIONS.map((pos) => (
                                <option key={pos} value={pos}>{pos}</option>
                            ))}
                        </select>
                        <Filter className="w-3.5 h-3.5 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={onClearAll}
                            className="text-xs font-medium px-3 py-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-xl transition-all active:scale-[0.98] flex items-center gap-1 cursor-pointer"
                        >
                            <X className="w-3.5 h-3.5" />
                            <span>Reset</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Domain Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                    type="button"
                    onClick={() => onDomainChange('')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.98] flex-shrink-0 cursor-pointer ${
                        !selectedDomain
                            ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                            : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                    }`}
                >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>All Domains</span>
                    {totalCount > 0 && (
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                            !selectedDomain ? 'bg-white/20 text-white dark:bg-zinc-800 dark:text-zinc-200' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                        }`}>
                            {totalCount}
                        </span>
                    )}
                </button>

                {DOMAINS.map((domain) => {
                    const isSelected = selectedDomain === domain;
                    const count = domainCounts[domain] || 0;

                    return (
                        <button
                            key={domain}
                            type="button"
                            onClick={() => onDomainChange(domain)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all active:scale-[0.98] flex-shrink-0 cursor-pointer ${
                                isSelected
                                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                                    : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800'
                            }`}
                        >
                            <span>{domain}</span>
                            {count > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                                    isSelected ? 'bg-white/20 text-white dark:bg-zinc-800 dark:text-zinc-200' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                                }`}>
                                    {count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
