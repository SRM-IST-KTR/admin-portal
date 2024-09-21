import { useState, useEffect } from "react";
import { useRouter } from "next/router";

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
      setUser(username);
      router.push("/");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Welcome</h1>
      {!user ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-black"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg text-black"
              required
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Login
          </button>
        </form>
      ) : (
        <div className="flex justify-around">
          <button
            onClick={() => router.push("/events")}
            className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Events
          </button>
          <button
            onClick={() => router.push("/recruitment")}
            className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-lg"
          >
            Recruitment
          </button>
        </div>
      )}
    </div>
  );
}
