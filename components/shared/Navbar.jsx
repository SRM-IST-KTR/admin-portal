import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { Calendar, Users, LogOut, Menu, X, UserCircle, UserPlus, ChevronDown, Home, CheckSquare } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const router = useRouter();
  const profileRef = useRef(null);
  const { user, isAdmin, handleLogout } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (path) => router.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <h3 className="text-xl font-bold text-gray-900">GCSRM</h3>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link
                  href="/events"
                  className={`flex items-center gap-2 transition-colors ${isActive("/events")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                    }`}
                >
                  <Calendar className="w-5 h-5" />
                  <span>Events</span>
                </Link>
                <Link
                  href="/tasks"
                  className={`flex items-center gap-2 transition-colors ${isActive("/tasks")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                    }`}
                >
                  <CheckSquare className="w-5 h-5" />
                  <span>Tasks</span>
                </Link>
                <Link
                  href="/recruitment"
                  className={`flex items-center gap-2 transition-colors ${isActive("/recruitment")
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                    }`}
                >
                  <Users className="w-5 h-5" />
                  <span>Recruitment</span>
                </Link>
                {isAdmin && (
                  <Link
                    href="/teams"
                    className={`flex items-center gap-2 transition-colors ${isActive("/teams")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                      }`}
                  >
                    <UserCircle className="w-5 h-5" />
                    <span>Team</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <UserCircle className="w-5 h-5" />
                    <span>{user?.name || "Profile"}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        My Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/"
                  className={`text-gray-600 hover:text-blue-600 transition-colors ${isActive("/") ? "text-blue-600" : ""
                    }`}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                >
                  <UserPlus className="w-5 h-5" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden transition-all duration-300 ease-in-out ${isMobileMenuOpen
            ? "max-h-screen opacity-100"
            : "max-h-0 opacity-0"
            }`}
        >
          <div className="py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              {user ? (
                <>
                  <Link
                    href="/events"
                    className={`flex items-center gap-2 transition-colors ${isActive("/events")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Calendar className="w-5 h-5" />
                    <span>Events</span>
                  </Link>
                  <Link
                    href="/tasks"
                    className={`flex items-center gap-2 transition-colors ${isActive("/tasks")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <CheckSquare className="w-5 h-5" />
                    <span>Tasks</span>
                  </Link>
                  <Link
                    href="/recruitment"
                    className={`flex items-center gap-2 transition-colors ${isActive("/recruitment")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Users className="w-5 h-5" />
                    <span>Recruitment</span>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/teams"
                      className={`flex items-center gap-2 transition-colors ${isActive("/teams")
                        ? "text-blue-600"
                        : "text-gray-600 hover:text-blue-600"
                        }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserCircle className="w-5 h-5" />
                      <span>Team</span>
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className={`flex items-center gap-2 transition-colors ${isActive("/profile")
                      ? "text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserCircle className="w-5 h-5" />
                    <span>My Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/"
                    className={`text-gray-600 hover:text-blue-600 transition-colors ${isActive("/") ? "text-blue-600" : ""
                      }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserPlus className="w-5 h-5" />
                    <span>Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
