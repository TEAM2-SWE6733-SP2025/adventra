"use client";
import Navbar from "../components/Navbar";
import MatchChat from "../components/MatchChat";

export default function ChatClient() {
  return (
    <>
      <header className="block w-full">
        <Navbar />
      </header>
      <main className="flex justify-center min-h-screen px-4 dark">
        <div className="flex w-full">
          <div className="flex-1">
            <MatchChat />
          </div>
        </div>
      </main>
    </>
  );
}
