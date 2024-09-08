import { useRouter } from "next/router";
import { useEffect } from "react";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();

    useEffect(() => {
      const user = localStorage.getItem("user");
      if (!user) {
        router.replace("/");
      }
    }, [router]);

    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
