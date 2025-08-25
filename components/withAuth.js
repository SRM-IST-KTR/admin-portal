import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { hasPermission } from "@/utils/permissions";

const withAuth = (WrappedComponent, allowedRoles = []) => {
  return (props) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Check if we're in the browser
      if (typeof window !== 'undefined') {
        try {
          const user = localStorage.getItem("user");
          if (!user) {
            router.replace("/");
            return;
          }

          const userData = JSON.parse(user);

          // If allowedRoles is empty, use the new permissions system
          if (allowedRoles.length === 0) {
            // Get the current path
            const path = router.pathname;

            // Check if user has permission for this route
            if (!hasPermission(userData, path)) {
              router.replace("/");
              return;
            }
          } else {
            // Legacy role-based check
            if (!allowedRoles.includes(userData.role)) {
              router.replace("/");
              return;
            }
          }

          setIsAuthorized(true);
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
          router.replace("/");
        } finally {
          setIsLoading(false);
        }
      }
    }, [router]);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!isAuthorized) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
