"use client";

import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { FaGithub, FaGoogle, FaApple } from "react-icons/fa";
import ValidatedEmailInput from "../../components/ValidateEmailInput";

export default function SignIn() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    const storedCredentials = localStorage.getItem("authCredentials");
    if (storedCredentials) {
      const { email: storedEmail, password: storedPassword } =
        JSON.parse(storedCredentials);
      setEmail(storedEmail);
      setPassword(storedPassword);

      localStorage.removeItem("authCredentials");
    }
  }, []);

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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Sign In</h1>
        {error && <p className="text-red-500 text-center">Error: {error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <ValidatedEmailInput
            value={email}
            onChange={setEmail}
            placeholder="Email"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-gray-200 dark:bg-gray-700 rounded-lg focus:outline-none"
          />
          <button
            type="submit"
            className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md"
          >
            Sign In with Email
          </button>
        </form>

        <div className="space-y-3">
          <button
            onClick={() => signIn("github")}
            className="w-full flex items-center justify-center gap-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold rounded-lg shadow-md"
          >
            <FaGithub size={20} />
            Sign in with GitHub
          </button>
          <button
            onClick={() => signIn("google")}
            className="w-full flex items-center justify-center gap-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg shadow-md"
          >
            <FaGoogle size={20} />
            Sign in with Google
          </button>
          <button
            onClick={() => signIn("apple")}
            className="w-full flex items-center justify-center gap-3 py-2 bg-black hover:bg-gray-800 text-white font-semibold rounded-lg shadow-md"
          >
            <FaApple size={20} />
            Sign in with Apple
          </button>
        </div>

        <div className="text-center">
          <p className="text-gray-500 dark:text-gray-400">
            Don't have an account?
          </p>
          <button
            onClick={() => router.push("/auth/signup")}
            className="mt-2 text-blue-500 dark:text-blue-400 hover:underline"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
