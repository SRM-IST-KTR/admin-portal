const EventSkeleton = () => (
    <div className="animate-pulse bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-full h-48 bg-gray-200"></div>
        <div className="p-4">
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
    </div>
);

export default EventSkeleton; 