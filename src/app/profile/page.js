"use client";
import Navbar from "../components/Navbar";
import Profile from "../components/Profile";

export default function ProfilePage() {
  return (
    <>
      <header className="block w-full">
        <Navbar />
      </header>
      <main className="flex justify-center items-center min-h-screen px-4 dark">
        <Profile />
      </main>
    </>
  );
}
