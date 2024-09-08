import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    router.push("/");
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h3 className="text-white text-lg font-bold">GCSRM</h3>
        <ul className="flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              <li>
                <a
                  href="/events"
                  className="text-white hover:text-gray-400 transition duration-300"
                >
                  Events
                </a>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-500 text-white py-2 px-4 rounded transition duration-300"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <li>
              <a
                href="/"
                className="text-white hover:text-gray-400 transition duration-300"
              >
                Login
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
