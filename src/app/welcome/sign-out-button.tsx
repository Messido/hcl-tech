"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/signin" })}
      className="btn btn-ghost btn-signout"
      id="signout-button"
    >
      Sign out
    </button>
  );
}
