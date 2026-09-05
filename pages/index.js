import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { LogIn, Calendar, Users, UserCircle, ArrowRight, Gem, Award } from "lucide-react";

const SURFACES = [
  {
    href: "/recruitment",
    title: "Recruitment Intake",
    description: "Candidate evaluation pipeline, task review, and demographic metrics",
    action: "Open Evaluation Deck",
    icon: Users,
    color: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50",
    actionColor: "text-purple-600 dark:text-purple-400",
  },
  {
    href: "/events",
    title: "Events & Desks",
    description: "Door check-in scanner, RSVP dispatch, and attendee rosters",
    action: "Manage Events Desk",
    icon: Calendar,
    color: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50",
    actionColor: "text-blue-600 dark:text-blue-400",
  },
  {
    href: "/teams",
    title: "Team Directory",
    description: "Club leads, associates, domain coordinators, and alumni network",
    action: "Open Team Roster",
    icon: UserCircle,
    color: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50",
    actionColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    href: "/sponsors",
    title: "Sponsors & Partners",
    description: "Partnership tiers, company logos, and official hackathon partner allocations",
    action: "Manage Partnerships",
    icon: Gem,
    color: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50",
    actionColor: "text-amber-600 dark:text-amber-400",
  },
  {
    href: "/certificates",
    title: "Certificate Registry",
    description: "Cryptographic SHA-256 verification records and administrative revocation desk",
    action: "Open Credential Desk",
    icon: Award,
    color: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50",
    actionColor: "text-indigo-600 dark:text-indigo-400",
  },
];

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
    } else {
      setError("Invalid credentials. Please verify username and password.");
    }
  };

  return (
    <div className="py-6 text-zinc-900 dark:text-zinc-100 max-w-7xl mx-auto transition-colors">
      {!user ? (
        /* Logged Out: Branded Sign-in Card */
        <div className="max-w-md mx-auto py-12 px-4">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700/80 mx-auto mb-3.5 p-2 shadow-xs flex items-center justify-center">
              <img
                src="/logo.png"
                alt="GitHub Community SRM Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              GCSRM Admin Gateway
            </h1>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
              Authorized club executive & coordinator login
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-zinc-200/90 dark:border-zinc-800 rounded-2xl p-7 shadow-sm">
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter administrator username"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-300 dark:border-zinc-700 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 transition-colors"
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-xl text-red-600 dark:text-red-400 text-xs">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Authenticate</span>
              </button>
            </form>
          </div>
        </div>
      ) : (
        /* Logged In: Clean Portal Hub */
        <div className="space-y-8">
          {/* Header Banner */}
          <div className="pb-6 border-b border-zinc-200 dark:border-zinc-800">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Welcome back, {user}
            </h1>
            <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
              GitHub Community SRM centralized administration & operations desk
            </p>
          </div>

          {/* 5 Clean Surface Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SURFACES.map(({ href, title, description, action, icon: Icon, color, actionColor }) => (
              <Link
                key={href}
                href={href}
                className="group bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200/90 dark:border-zinc-800 shadow-xs hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-150 flex flex-col justify-between"
              >
                <div>
                  <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center mb-4`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                    {title}
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1.5 leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className={`mt-6 flex items-center justify-between text-xs font-semibold ${actionColor} pt-3 border-t border-zinc-100 dark:border-zinc-800/80`}>
                  <span>{action}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-150" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
