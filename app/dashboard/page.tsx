import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
export const instant = false;


export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <p>Welcome, {user.name}!</p>

      <form action="api/logout" method="POST">
        <button type="submit">Log out</button>
      </form>
    </main>
  );
}
