import "@/styles/globals.css";
import Navbar from "@/components/shared/Navbar";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AuthProvider } from '../contexts/AuthContext';

export default function App({ Component, pageProps }) {
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
        localStorage.removeItem("isAdmin");
      }
    }

    // Allow access to public pages without authentication
    const publicPages = ["/", "/signup"];
    if (!user && !publicPages.includes(router.pathname)) {
      router.push("/");
    }
  }, [router]);

  return (
    <AuthProvider>
      <Navbar />
      <div className="container mx-auto p-4">
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
