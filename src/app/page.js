"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link"

export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState(1);

  const adventures = [
    {
      id: 1,
      name: "Scuba Diving",
      location: "Redang Island, Malaysia",
      image: "/scuba.jpg",
    },
    {
      id: 2,
      name: 'Mountain Biking',
      location: "Rocky Mountains, USA",
      image: "/biking.jpg",
    },
    {
      id: 3,
      name: "Safari",
      location: 'Serengeti, Tanzania',
      image: "/safari.jpg",
    },
  ];

  useEffect(() => {
    document.body.style.overflow = "hidden"; // Prevents page scrolling
    return () => {
      document.body.style.overflow = "auto"; // Restores scrolling when unmounted
    };
  }, []);

  const handleSwipe = (direction) => {
    setAnimationDirection(direction === "left" ? -1 : 1);
    setCurrentIndex((prev) =>
      direction === "left"
        ? (prev + 1) % adventures.length
        : prev === 0
          ? adventures.length - 1
          : prev - 1,
    );
  };

  return (
    <main className="relative w-full h-screen overflow-hidden flex flex-col bg-black">
      {/* Navbar */}
      <nav className="absolute top-0 w-full flex items-center justify-between px-6 py-4 bg-black/60 text-white z-30">
        <h1 className="text-2xl font-bold">Adventra</h1>
        <div>
          <h1>Home</h1>
          <Link href="/about">About</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="absolute top-20 left-0 w-full text-center text-white px-6 z-30">
        <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
          Meet Adventurers,{" "}
          <span className="text-yellow-400">Explore Together</span>
        </h1>
        <p className="mt-4 text-lg md:text-xl text-gray-200">
          Find like-minded people to join you on your next adventure.
        </p>
      </header>

      {/* Adventure Swiper */}
      <section className="relative w-full h-full flex justify-center items-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={adventures[currentIndex].id}
            initial={{ x: `${animationDirection * 100  }%`, opacity: 1 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: `${-animationDirection * 100  }%`, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }} // No delay, fast transition
            className="absolute w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${adventures[currentIndex].image})`,
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.0}
            onDragEnd={(event, info) => {
              if (info.offset.x < -0.1)
                handleSwipe("right"); // Match
              else if (info.offset.x > 0.1) handleSwipe("left"); // Pass
            }}
          >
            {/* Overlay & Adventure Info */}
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white px-6">
              <h2 className="text-4xl font-bold">
                {adventures[currentIndex].name}
              </h2>
              <p className="text-lg">{adventures[currentIndex].location}</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      {/* Swipe Buttons */}
      <div className="absolute bottom-16 w-full flex justify-center gap-6 z-10">
        <button
          onClick={() => handleSwipe("left")}
          className="w-20 h-20 bg-gray-900 hover:bg-gray-700 text-white font-semibold text-lg rounded-xl shadow-lg active:scale-95"
        >
          Pass
        </button>
        <button
          onClick={() => handleSwipe("right")}
          className="w-20 h-20 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold text-lg rounded-xl shadow-lg active:scale-95"
        >
          Match
        </button>
      </div>
    </main>
  );
}
