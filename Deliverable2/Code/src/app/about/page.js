"use client";
import Navbar from "../components/Navbar.jsx";

export default function AboutPage() {
  return (
    <>
      <header className="block w-full">
        <Navbar />
      </header>
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col items-center bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6 text-center">
            About Us
          </h1>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed text-center">
            Welcome to{" "}
            <span className="font-bold text-yellow-500">Adventra</span>! We are
            passionate about connecting adventurers from around the world.
            Whether you're into scuba diving, mountain biking, or safaris,
            Adventra is here to help you find like-minded people to share your
            journey.
          </p>
          <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed mt-4 text-center">
            Our mission is to make exploring the world more fun, safe, and
            collaborative. Join us and start your next adventure today!
          </p>
        </div>
      </main>
    </>
  );
}
