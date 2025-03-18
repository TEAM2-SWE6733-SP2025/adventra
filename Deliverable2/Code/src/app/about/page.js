import Navbar from "../components/Navbar.jsx";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-6 py-12 mt-16">
        <h1 className="text-4xl font-bold mb-6">About Us</h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Welcome to Adventra! We are passionate about connecting adventurers
          from around the world. Whether you&#39;re into scuba diving, mountain
          biking, or safaris, Adventra is here to help you find like-minded
          people to share your journey.
        </p>
        <p className="text-lg text-gray-700 dark:text-gray-300 mt-4">
          Our mission is to make exploring the world more fun, safe, and
          collaborative. Join us and start your next adventure today!
        </p>
      </main>
    </>
  );
}
