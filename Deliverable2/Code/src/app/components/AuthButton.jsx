"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function AuthButton() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center space-x-4">
      {session ? (
        <>
          {session.user.image && (
            <img
              src={session.user.image}
              alt="User Profile"
              className="w-8 h-8 rounded-full"
            />
          )}
          <button
            onClick={() => signOut()}
            className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn()}
          className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-500"
        >
          Login
        </button>
      )}
    </div>
  );
}
