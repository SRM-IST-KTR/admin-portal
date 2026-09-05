import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Users, LogOut, Menu, X, UserCircle, Gem, Award } from "lucide-react";

const NAV_LINKS = [
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/recruitment", label: "Recruitment", icon: Users },
  { href: "/teams", label: "Team", icon: UserCircle },
  { href: "/sponsors", label: "Sponsors", icon: Gem },
  { href: "/certificates", label: "Certificates", icon: Award },
];

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(Boolean(user));
  }, [router.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("isAdmin");
    setIsLoggedIn(false);
    setIsMobileMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200/80 dark:border-zinc-800 sticky top-0 z-40 transition-colors">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 focus-visible:outline-none group">
            <div className="w-8 h-8 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 p-0.5 shadow-xs">
              <img
                src="/logo.png"
                alt="GitHub Community SRM"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-none group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                GitHub Community SRM
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wide">
                Admin Gateway
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            {isLoggedIn ? (
              <>
                {NAV_LINKS.map(({ href, label, icon: Icon }) => {
                  const isActive = router.pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all active:scale-[0.98] ${
                        isActive
                          ? "bg-zinc-100 dark:bg-zinc-800 text-blue-600 dark:text-blue-400"
                          : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-blue-600 dark:text-blue-400" : "text-zinc-400"}`} />
                      <span>{label}</span>
                    </Link>
                  );
                })}

                <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 mx-2" />

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-all active:scale-[0.98] cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1.5 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-zinc-100 dark:border-zinc-800 space-y-1">
            {isLoggedIn ? (
              <>
                {NAV_LINKS.map(({ href, label, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  >
                    <Icon className="w-4 h-4 text-zinc-400" />
                    <span>{label}</span>
                  </Link>
                ))}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 text-xs font-semibold text-blue-600"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
