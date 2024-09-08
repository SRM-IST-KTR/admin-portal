import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const SESSION_TIMEOUT = 6 * 60 * 60 * 1000;

  useEffect(() => {
    const user = localStorage.getItem("user");
    const loginTime = localStorage.getItem("loginTime");

    if (user && loginTime) {
      const currentTime = new Date().getTime();
      const timeElapsed = currentTime - parseInt(loginTime, 10);

      if (timeElapsed > SESSION_TIMEOUT) {
        localStorage.removeItem("user");
        localStorage.removeItem("loginTime");
        router.push("/");
      } else {
        router.push("/events");
      }
    }
  }, [router]);

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
      router.push("/events");
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
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
    </div>
  );
}
