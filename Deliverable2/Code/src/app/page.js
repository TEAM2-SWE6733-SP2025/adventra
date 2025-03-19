"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar.jsx";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState(1);
  const headerRef = useRef(null);

  const adventures = [
    {
      id: 1,
      name: "Scuba Diving",
      location: "Redang Island, Malaysia",
      image: "/scuba.jpg",
    },
    {
      id: 2,
      name: "Mountain Biking",
      location: "Rocky Mountains, USA",
      image: "/biking.jpg",
    },
    {
      id: 3,
      name: "Safari",
      location: "Serengeti, Tanzania",
      image: "/safari.jpg",
    },
  ];

  useEffect(() => {
    const handleMouseMove = (event) => {
      const menuHeight = headerRef.current?.offsetHeight || 0;

      if (event.clientY <= menuHeight) {
        setShowMenu(true);
      } else {
        setShowMenu(false);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleSwipe = (direction) => {
    setAnimationDirection(direction === "left" ? -1 : 1);
    setCurrentIndex((prev) =>
      direction === "left"
        ? (prev + 1) % adventures.length
        : prev === 0
          ? adventures.length - 1
          : prev - 1
    );
  };

  const handleMenuToggle = (isOpen) => {
    setMenuOpen(isOpen);
  };

  return (
    <div>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 ${showMenu ? "translate-y-0" : "-translate-y-full"
          }`}
      >
        <Navbar onMenuToggle={handleMenuToggle} />
      </header>

      <main className="relative w-full h-screen overflow-hidden flex flex-col">
        <section className="absolute inset-0 flex flex-col justify-start items-center text-center text-white px-6 pt-16 z-10">
          <h1 className="text-4xl md:text-6xl font-bold drop-shadow-2xl">
            Meet Adventurers,{" "}
            <span className="text-yellow-400">Explore Together</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-200 drop-shadow-lg">
            Find like-minded people to join you on your next adventure.
          </p>
        </section>

        <section className="absolute inset-0 w-full h-full flex justify-center items-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={adventures[currentIndex].id}
              initial={{ x: `${animationDirection * 100}%`, opacity: 1 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: `${-animationDirection * 100}%`, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${adventures[currentIndex].image})`,
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.0}
              onDragEnd={(event, info) => {
                if (info.offset.x < -0.1) handleSwipe("right");
                else if (info.offset.x > 0.1) handleSwipe("left");
              }}
            >
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-6">
                <h2 className="text-4xl font-bold">
                  {adventures[currentIndex].name}
                </h2>
                <p className="text-lg">{adventures[currentIndex].location}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>

        <div className="absolute bottom-16 w-full flex justify-center gap-6 z-20">
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
    </div>
  );
}