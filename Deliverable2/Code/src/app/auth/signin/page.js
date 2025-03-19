"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: true,
      email,
      password,
    });
    if (!result?.ok) {
      console.error("Error signing in", result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-3xl font-bold text-center">Sign In</h1>
        {error && <p className="text-red-500 text-center">Error: {error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded-lg focus:outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-800 rounded-lg focus:outline-none"
          />
          <button type="submit" className="w-full p-3 bg-green-600 rounded-lg">
            Sign In with Email
          </button>
        </form>

        <button
          onClick={() => signIn("github")}
          className="w-full py-2 bg-gray-800 hover:bg-gray-700 rounded-lg"
        >
          Sign in with GitHub
        </button>
        <button
          onClick={() => signIn("google")}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
        >
          Sign in with Google
        </button>
        <button
          onClick={() => signIn("apple")}
          className="w-full py-2 bg-black hover:bg-gray-800 rounded-lg"
        >
          Sign in with Apple
        </button>
      </div>
    </div>
  );
}