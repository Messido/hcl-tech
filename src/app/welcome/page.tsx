import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import SignOutButton from "./sign-out-button";

export default async function WelcomePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/signin");
  }

  const user = session.user;
  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  const hour = new Date().getHours();
  let greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";

  return (
    <div className="welcome-page">
      <nav className="welcome-nav">
        <div className="welcome-nav-brand">
          <div className="welcome-nav-logo">AM</div>
          <span>Asset Management</span>
        </div>
        <div className="welcome-nav-user">
          <div className="welcome-user-info">
            <div className="welcome-user-name">{user.name}</div>
            <div className="welcome-user-email">{user.email}</div>
          </div>
          <SignOutButton />
        </div>
      </nav>

      <main className="welcome-hero">
        <div className="welcome-avatar">{initials}</div>
        <h1 className="welcome-greeting">
          {greeting}, {user.name?.split(" ")[0]}!
        </h1>
        <p className="welcome-subtitle">
          You&apos;ve successfully signed in. Your account is secure and ready to use.
        </p>

        <div className="welcome-stats">
          <div className="stat-card">
            <div className="stat-icon">🔒</div>
            <div className="stat-label">Status</div>
            <div className="stat-value">Secure</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">⚡</div>
            <div className="stat-label">Session</div>
            <div className="stat-value">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">🛡️</div>
            <div className="stat-label">Auth</div>
            <div className="stat-value">JWT</div>
          </div>
        </div>
      </main>
    </div>
  );
}
