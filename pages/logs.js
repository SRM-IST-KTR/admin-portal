import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { AlertCircle, CheckCircle, XCircle, Clock, Filter, ArrowLeft, List } from "lucide-react";
import axios from "axios";
import withAuth from "@/components/withAuth";
import { useAuth } from "@/contexts/AuthContext";

function Logs() {
    const [loginLogs, setLoginLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterRole, setFilterRole] = useState("all");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalLogs, setTotalLogs] = useState(0);
    const router = useRouter();
    const { isAdmin } = useAuth();

    useEffect(() => {
        // Redirect if not admin
        if (!isAdmin) {
            router.push("/");
        }
    }, [isAdmin, router]);

    useEffect(() => {
        if (isAdmin) {
            fetchLoginLogs();
        }
    }, [isAdmin, filterStatus, filterRole, page, rowsPerPage]);

    const fetchLoginLogs = async () => {
        setLoading(true);
        setError("");

        try {
            const queryParams = new URLSearchParams();
            queryParams.append("page", page.toString());
            queryParams.append("limit", rowsPerPage.toString());

            if (filterStatus !== "all") {
                queryParams.append("status", filterStatus);
            }

            if (filterRole !== "all") {
                queryParams.append("role", filterRole);
            }

            const response = await axios.get(`/api/v1/auth/logs?${queryParams.toString()}`);

            if (response.data.success) {
                setLoginLogs(response.data.data.logs);
                setTotalPages(response.data.data.totalPages);
                setTotalLogs(response.data.data.totalLogs);
            } else {
                setError("Failed to fetch login logs");
            }
        } catch (err) {
            console.error("Error fetching logs:", err);
            setError("Failed to fetch login logs. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    const getStatusIcon = (status) => {
        if (status === "success") {
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        } else {
            return <XCircle className="w-5 h-5 text-red-500" />;
        }
    };

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case "admin":
                return "bg-purple-100 text-purple-800";
            case "manager":
                return "bg-blue-100 text-blue-800";
            case "member":
                return "bg-green-100 text-green-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const handleRowsPerPageChange = (e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1); // Reset to first page when changing rows per page
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="flex items-center mb-6">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-1" />
                        Back to Dashboard
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">Login Activity Logs</h1>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-4 mb-6">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex items-center">
                            <Filter className="w-5 h-5 text-gray-500 mr-2" />
                            <select
                                value={filterStatus}
                                onChange={(e) => {
                                    setFilterStatus(e.target.value);
                                    setPage(1); // Reset to first page when filter changes
                                }}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="success">Successful</option>
                                <option value="failed">Failed</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <Filter className="w-5 h-5 text-gray-500 mr-2" />
                            <select
                                value={filterRole}
                                onChange={(e) => {
                                    setFilterRole(e.target.value);
                                    setPage(1); // Reset to first page when filter changes
                                }}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Roles</option>
                                <option value="admin">Admin</option>
                                <option value="manager">Manager</option>
                                <option value="member">Member</option>
                            </select>
                        </div>

                        <div className="flex items-center">
                            <List className="w-5 h-5 text-gray-500 mr-2" />
                            <select
                                value={rowsPerPage}
                                onChange={handleRowsPerPageChange}
                                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="10">10 Rows</option>
                                <option value="30">30 Rows</option>
                                <option value="50">50 Rows</option>
                                <option value="100">100 Rows</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : error ? (
                        <div className="p-6">
                            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg flex items-center">
                                <AlertCircle className="w-5 h-5 mr-2" />
                                <span>{error}</span>
                            </div>
                        </div>
                    ) : loginLogs.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No login logs found
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Address</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {loginLogs.map((log) => (
                                            <tr key={log._id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{log.email}</div>
                                                    {log.user && (
                                                        <div className="text-sm text-gray-500">{log.user.name}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(log.role)}`}>
                                                        {log.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        {getStatusIcon(log.status)}
                                                        <span className={`ml-2 text-sm ${log.status === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                                                            {log.status}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    <div className="flex items-center">
                                                        <Clock className="w-4 h-4 mr-1" />
                                                        {formatDate(log.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {log.ipAddress || "N/A"}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                                <div className="flex-1 flex justify-between sm:hidden">
                                    <button
                                        onClick={() => setPage(page - 1)}
                                        disabled={page === 1}
                                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(page + 1)}
                                        disabled={page === totalPages}
                                        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'
                                            }`}
                                    >
                                        Next
                                    </button>
                                </div>
                                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-sm text-gray-700">
                                            Showing <span className="font-medium">{loginLogs.length > 0 ? (page - 1) * rowsPerPage + 1 : 0}</span> to{' '}
                                            <span className="font-medium">{Math.min(page * rowsPerPage, totalLogs)}</span> of{' '}
                                            <span className="font-medium">{totalLogs}</span> results
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <span className="text-sm text-gray-700 mr-2">Rows per page:</span>
                                        <select
                                            value={rowsPerPage}
                                            onChange={handleRowsPerPageChange}
                                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="10">10</option>
                                            <option value="30">30</option>
                                            <option value="50">50</option>
                                            <option value="100">100</option>
                                        </select>
                                    </div>
                                    <div>
                                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                            <button
                                                onClick={() => setPage(page - 1)}
                                                disabled={page === 1}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className="sr-only">Previous</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                            {totalPages <= 7 ? (
                                                // Show all pages if there are 7 or fewer
                                                [...Array(totalPages)].map((_, i) => (
                                                    <button
                                                        key={i + 1}
                                                        onClick={() => setPage(i + 1)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === i + 1
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {i + 1}
                                                    </button>
                                                ))
                                            ) : (
                                                // Show limited pages with ellipsis for large numbers
                                                <>
                                                    {/* Always show first page */}
                                                    <button
                                                        onClick={() => setPage(1)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === 1
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        1
                                                    </button>

                                                    {/* Show ellipsis if current page is far from start */}
                                                    {page > 3 && (
                                                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                            ...
                                                        </span>
                                                    )}

                                                    {/* Show nearby pages */}
                                                    {[...Array(5)].map((_, i) => {
                                                        // Calculate which pages to show around current page
                                                        const pageNum = Math.max(2, page - 1) + i;
                                                        if (pageNum > 1 && pageNum < totalPages) {
                                                            return (
                                                                <button
                                                                    key={pageNum}
                                                                    onClick={() => setPage(pageNum)}
                                                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === pageNum
                                                                        ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                        }`}
                                                                >
                                                                    {pageNum}
                                                                </button>
                                                            );
                                                        }
                                                        return null;
                                                    })}

                                                    {/* Show ellipsis if current page is far from end */}
                                                    {page < totalPages - 2 && (
                                                        <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                                                            ...
                                                        </span>
                                                    )}

                                                    {/* Always show last page */}
                                                    <button
                                                        onClick={() => setPage(totalPages)}
                                                        className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === totalPages
                                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                            }`}
                                                    >
                                                        {totalPages}
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => setPage(page + 1)}
                                                disabled={page === totalPages}
                                                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${page === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <span className="sr-only">Next</span>
                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </nav>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default withAuth(Logs); 