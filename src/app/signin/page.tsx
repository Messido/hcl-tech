"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else {
        router.push("/assets");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-side">
        <div className="auth-side-dots" />
        <div className="auth-side-content">
          <p className="auth-side-quote">
            &ldquo;The best security is the kind you never have to think about.&rdquo;
          </p>
          <p className="auth-side-attr">Secure by default</p>
        </div>
      </div>

      <div className="auth-main">
        <div className="auth-card">
          <div className="auth-brand">
            <h1>Welcome back</h1>
            <p>Enter your credentials to continue</p>
          </div>

          {error && (
            <div className="message message-error" id="signin-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} id="signin-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              id="signin-button"
            >
              {loading ? <span className="spinner" /> : "Sign in"}
            </button>
          </form>

          <div className="auth-footer">
            Don&apos;t have an account?{" "}
            <Link href="/signup">Create one</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
