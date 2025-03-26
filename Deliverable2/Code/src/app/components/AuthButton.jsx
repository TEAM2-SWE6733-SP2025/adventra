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
            className="border border-yellow-500 text-yellow-500 px-4 py-2 rounded-lg hover:bg-yellow-900 cursor-pointer"
          >
            Logout
          </button>
        </>
      ) : (
        <button
          onClick={() => signIn()}
          className="bg-yellow-500 text-black hover:bg-yellow-600 px-4 py-2 rounded-lg cursor-pointer"
        >
          Login
        </button>
      )}
    </div>
  );
}
