import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { UserPlus, CheckCircle, XCircle, AlertCircle, ArrowLeft, Ban } from "lucide-react";
import axios from "axios";
import withAuth from "@/components/withAuth";

function PendingUsers() {
    const [allUsers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [approvingId, setApprovingId] = useState(null);
    const [revokingId, setRevokingId] = useState(null);
    const router = useRouter();

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const fetchAllUsers = async () => {
        setLoading(true);
        setError("");

        try {
            // Fetch all users in a single request
            const response = await axios.get("/api/v1/users/all");

            if (response.data.success) {
                setAllUsers(response.data.data.users);
            } else {
                setError("Failed to fetch users");
            }
        } catch (err) {
            console.error("Error fetching users:", err);
            setError("Failed to fetch users. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId) => {
        setApprovingId(userId);
        setError("");

        try {
            const response = await axios.post("/api/v1/users/approve", { userId });

            if (response.data.success) {
                // Update the user in the list
                setAllUsers(prevUsers =>
                    prevUsers.map(user =>
                        user._id === userId
                            ? { ...user, isApproved: true, status: "approved", approvalDate: new Date() }
                            : user
                    )
                );
            } else {
                setError(response.data.error || "Failed to approve user");
            }
        } catch (err) {
            console.error("Error approving user:", err);
            setError(err.response?.data?.error || "An error occurred while approving the user");
        } finally {
            setApprovingId(null);
        }
    };

    const handleRevoke = async (userId) => {
        setRevokingId(userId);
        setError("");

        try {
            const response = await axios.post("/api/v1/users/revoke", { userId });

            if (response.data.success) {
                // Update the user in the list
                setAllUsers(prevUsers =>
                    prevUsers.map(user =>
                        user._id === userId
                            ? { ...user, isApproved: false, status: "pending", revocationDate: new Date() }
                            : user
                    )
                );
            } else {
                setError(response.data.error || "Failed to revoke user access");
            }
        } catch (err) {
            console.error("Error revoking user access:", err);
            setError(err.response?.data?.error || "An error occurred while revoking user access");
        } finally {
            setRevokingId(null);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleString();
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
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg mb-6 flex items-center">
                        <AlertCircle className="w-5 h-5 mr-2" />
                        <span>{error}</span>
                    </div>
                )}

                <div className="bg-white rounded-lg shadow overflow-hidden">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                    ) : allUsers.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No users found
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Domain</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {allUsers.map((user) => (
                                        <tr key={user._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.position}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.domain}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                    user.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                                    {user.status === 'approved' ? 'Approved' : 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {user.status === 'approved' ? formatDate(user.approvalDate) : formatDate(user.createdAt)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                {user.status === 'pending' ? (
                                                    <button
                                                        onClick={() => handleApprove(user._id)}
                                                        disabled={approvingId === user._id}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {approvingId === user._id ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Approving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <CheckCircle className="w-4 h-4 mr-1" />
                                                                Approve
                                                            </>
                                                        )}
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleRevoke(user._id)}
                                                        disabled={revokingId === user._id}
                                                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    >
                                                        {revokingId === user._id ? (
                                                            <>
                                                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                                </svg>
                                                                Revoking...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Ban className="w-4 h-4 mr-1" />
                                                                Revoke
                                                            </>
                                                        )}
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default withAuth(PendingUsers, ["admin"]); 