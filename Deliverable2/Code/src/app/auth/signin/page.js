"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { FaGithub, FaGoogle, FaApple } from "react-icons/fa";
import Card from "../../components/Card";
import Button from "../../components/Button";

export default function SignInPage() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
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
      redirect: false,
      email,
      password,
      callbackUrl,
    });

    if (result?.error) {
      console.error("Sign-in error:", result.error);
    } else {
      router.push(result.url || callbackUrl);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-extrabold text-center mb-6">Sign In</h1>
        {error && (
          <p className="text-red-500 text-center mb-4">
            {error === "CredentialsSignin"
              ? "Invalid email or password."
              : "An error occurred. Please try again."}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 dark:text-gray-300 font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Enter your password"
              required
            />
          </div>
          <Button
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-md"
          >
            Sign In
          </Button>
        </form>
        <div className="mt-6">
          <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
            Or sign in with
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => signIn("github", { callbackUrl })}
              className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-full"
            >
              <FaGithub size={20} />
            </button>
            <button
              onClick={() => signIn("google", { callbackUrl })}
              className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-full"
            >
              <FaGoogle size={20} />
            </button>
            <button
              onClick={() => signIn("apple", { callbackUrl })}
              className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-full"
            >
              <FaApple size={20} />
            </button>
          </div>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-center mt-6">
          Don&#39;t have an account?{" "}
          <a href="/auth/signup" className="text-yellow-500 hover:underline">
            Sign Up
          </a>
        </p>
      </Card>
    </div>
  );
}
