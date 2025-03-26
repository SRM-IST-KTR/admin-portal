import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { LogIn, Calendar, Users, LogOut, UserCog } from "lucide-react";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(storedUser);
      }
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    const adminUsername = process.env.NEXT_PUBLIC_ADMIN_USERNAME;
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
    const managerUsername = process.env.NEXT_PUBLIC_MANAGER_USERNAME;
    const managerPassword = process.env.NEXT_PUBLIC_MANAGER_PASSWORD;

    if (
      (username === adminUsername && password === adminPassword) ||
      (username === managerUsername && password === managerPassword)
    ) {
      const currentTime = new Date().getTime();
      localStorage.setItem("user", username);
      localStorage.setItem("loginTime", currentTime.toString());
      localStorage.setItem("isAdmin", (username === adminUsername).toString());
      setUser(username);
      router.push("/");
    } else {
      setError("Invalid username or password");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("isAdmin");
    setUser(null);
    router.push("/");
  };

  const isAdmin = typeof window !== "undefined" && localStorage.getItem("isAdmin") === "true";

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
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your username"
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

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
              >
                <LogIn className="w-5 h-5" />
                Sign In
              </button>
            </form>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">Welcome, {user}</h2>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
