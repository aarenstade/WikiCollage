import { useRouter } from "next/dist/client/router";
import { useEffect } from "react";

const FourOhFourPage = () => {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.push("/"), 2000);
  });

  return (
    <div>
      <h3 style={{ position: "absolute", top: "var(--navbar-offset)", left: "calc(100vw / 2)", color: "white" }}>
        404... Page Not Found.
      </h3>
    </div>
  );
};

export default FourOhFourPage;
