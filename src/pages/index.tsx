import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
// home page
const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading

    // Redirect to sign-in page if not authenticated
    if (!session) {
      router.push("/auth/signin");
      return;
    }

    // Check if the user is on a specific page where you don't want to redirect them
    const excludedPages = ["/employees/create", "/departments/create"]; // Add pages you want to exclude
    if (!excludedPages.includes(router.pathname)) {
      // Redirect to employee list view if not on an excluded page
      router.push("/employees");
    }
  }, [session, status, router]);

  if (status === "loading") return <p>Loading...</p>;
  if (!session) return null; // Return null if not authenticated

  const user = session.user as { id: string; email: string; role: string; name?: string; image?: string };

  return (
    <div>
      <h1>Welcome, {user.name || "User"}</h1>
      <p>Role: {user.role}</p>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
};

export default Home;
