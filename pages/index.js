import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LogIn, Calendar, Users, LogOut, UserCog, AlertCircle, CheckCircle, XCircle, Clock, Filter, UserPlus, Lock } from "lucide-react";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loginLogs, setLoginLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(false);
  const [logsError, setLogsError] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [pendingUsersCount, setPendingUsersCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user, isAdmin, setUser, setIsAdmin } = useAuth();

  useEffect(() => {
    if (isAdmin) {
      fetchLoginLogs();
      fetchPendingUsers();
    }
  }, [isAdmin, filterStatus]);

  const fetchLoginLogs = async () => {
    setLogsLoading(true);
    setLogsError("");

    try {
      const queryParams = new URLSearchParams();
      queryParams.append("limit", "5");
      if (filterStatus !== "all") {
        queryParams.append("status", filterStatus);
      }

      const response = await axios.get(`/api/v1/auth/logs?${queryParams.toString()}`);
      if (response.data.success) {
        setLoginLogs(response.data.data.logs);
      } else {
        setLogsError("Failed to fetch login logs");
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
      setLogsError("Failed to fetch login logs");
    } finally {
      setLogsLoading(false);
    }
  };

  const fetchPendingUsers = async () => {
    try {
      const response = await axios.get("/api/v1/users/all");
      if (response.data.success) {
        // Count only pending users
        const pendingUsers = response.data.data.users.filter(user => !user.isApproved);
        setPendingUsersCount(pendingUsers.length);
      }
    } catch (err) {
      console.error("Error fetching pending users:", err);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });

      if (response.data.success) {
        const userData = response.data.user;
        const currentTime = new Date().getTime();
        const isUserAdmin = userData.role === "admin";

        // Store user info in localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("loginTime", currentTime.toString());
        localStorage.setItem("isAdmin", isUserAdmin.toString());

        // Update global auth state
        setUser(userData);
        setIsAdmin(isUserAdmin);

        // Fetch admin data if user is admin
        if (isUserAdmin) {
          fetchLoginLogs();
          fetchPendingUsers();
        }

        router.push("/");
      } else {
        setError(response.data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response?.status === 403) {
        setError("Your account is pending admin approval");
      } else if (err.response?.status === 401) {
        setError("Invalid email or password");
      } else {
        setError("An error occurred during login");
      }
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-black dark:text-white">
            Github Club Admin Portal
          </h1>
          <p className="text-black dark:text-white text-lg max-w-2xl mx-auto">
            Manage events, track participants, and oversee club activities all in one place.
          </p>
        </div>

        {!user ? (
          <div className="max-w-md mx-auto bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2 text-gray-900">Welcome Back</h2>
              <p className="text-gray-500">Please sign in to continue</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
                >
                  <LogIn className="w-5 h-5" />
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{" "}
                  <button
                    type="button"
                    onClick={() => router.push("/signup")}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Sign up
                  </button>
                </p>
              </div>
            </form>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">Welcome, {user.name}</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push("/change-password")}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    <Lock className="w-5 h-5" />
                    <span>Change Password</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <button
                  onClick={() => router.push("/events")}
                  className="group bg-gray-50 hover:bg-gray-100 p-6 rounded-xl border border-gray-200 transition-all transform hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                      <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg mb-1 text-gray-900">Events</h3>
                      <p className="text-gray-500 text-sm">Manage and track event participants</p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => router.push("/recruitment")}
                  className="group bg-gray-50 hover:bg-gray-100 p-6 rounded-xl border border-gray-200 transition-all transform hover:scale-[1.02]"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-lg mb-1 text-gray-900">Recruitment</h3>
                      <p className="text-gray-500 text-sm">Handle club recruitment process</p>
                    </div>
                  </div>
                </button>

                {isAdmin && (
                  <button
                    onClick={() => router.push("/teams")}
                    className="group bg-gray-50 hover:bg-gray-100 p-6 rounded-xl border border-gray-200 transition-all transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors">
                        <UserCog className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-lg mb-1 text-gray-900">Team Management</h3>
                        <p className="text-gray-500 text-sm">Manage team members and roles</p>
                      </div>
                    </div>
                  </button>
                )}

                {isAdmin && (
                  <button
                    onClick={() => router.push("/users/pending")}
                    className="group bg-purple-50 hover:bg-purple-100 p-6 rounded-xl border border-purple-200 transition-all transform hover:scale-[1.02]"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors relative">
                        <UserPlus className="w-6 h-6 text-purple-600" />
                        {pendingUsersCount > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                            {pendingUsersCount}
                          </span>
                        )}
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-gray-900">Approvals</h3>
                          {pendingUsersCount > 0 && (
                            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                              {pendingUsersCount} new
                            </span>
                          )}
                        </div>
                        <p className="text-gray-500 text-sm">Review and approve user registrations</p>
                      </div>
                    </div>
                  </button>
                )}
              </div>

              {/* Login Logs Card - Admin Only */}
              {isAdmin && (
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Login Activity</h3>
                    <div className="flex items-center gap-2">
                      <Filter className="w-4 h-4 text-gray-500" />
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="all">All Logins</option>
                        <option value="success">Successful</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>

                  {logsLoading ? (
                    <div className="flex justify-center items-center h-40">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                  ) : logsError ? (
                    <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      <span>{logsError}</span>
                    </div>
                  ) : loginLogs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No login logs found
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {loginLogs.map((log) => (
                            <tr key={log._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {log.email}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${log.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                  log.role === 'manager' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                  {log.role}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm">
                                <div className="flex items-center gap-2">
                                  {getStatusIcon(log.status)}
                                  <span className={log.status === 'success' ? 'text-green-600' : 'text-red-600'}>
                                    {log.status}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-4 h-4" />
                                  {formatDate(log.createdAt)}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <div className="mt-4 text-right">
                    <button
                      onClick={() => router.push('/logs')}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      View All Logs
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
