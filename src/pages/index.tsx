import { useSession, signOut } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { Session } from "next-auth";

const Home = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Do nothing while loading
    if (!session) {
      router.push("/auth/signin");
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
