"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "./components/Navbar.jsx";
import Button from "./components/Button.jsx";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession(); // Get session data
  const [menuOpen, setMenuOpen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animationDirection, setAnimationDirection] = useState(1);
  const [adventures, setAdventures] = useState([]);
  const headerRef = useRef(null);

  const staticAdventureList = [
    {
      id: 1,
      name: "Safari",
      location: "Serengeti, Tanzania",
      image: "/safari.jpg",
    },
    {
      id: 2,
      name: "Mountain Biking",
      location: "Rocky Mountains, USA",
      image: "/biking.jpg",
    },
    {
      id: 3,
      name: "Scuba Diving",
      location: "Redang Island, Malaysia",
      image: "/scuba.jpg",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/matching");
        if (!response.ok) {
          console.log("error fetching data");
        }
        const data = await response.json();
        setAdventures(data);
        console.log("Fetched data:", data);
      } catch (error) {
        console.error(error);
      }
    };

    if (session) {
      fetchData();
    }

    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [session]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleSwipeStaticImages("right");
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

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

  const handleSwipeStaticImages = (direction) => {
    setAnimationDirection(direction === "left" ? -1 : 1);
    setCurrentIndex((prev) =>
      direction === "left"
        ? (prev + 1) % staticAdventureList.length
        : prev === 0
          ? staticAdventureList.length - 1
          : prev - 1,
    );
  };

  const handleMenuToggle = (isOpen) => {
    setMenuOpen(isOpen);
    console.log("Menu Open:", menuOpen);
  };

  if (adventures.length === 0) {
    return (
      <main className="relative w-full h-screen overflow-hidden flex flex-col bg-black">
        <header
          ref={headerRef}
          className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 
          ${showMenu ? "translate-y-0" : "-translate-y-full"}`}
        >
          <Navbar onMenuToggle={handleMenuToggle} />
        </header>

        <section className="absolute top-20 left-0 w-full text-center text-white px-6 z-30">
          <h1
            className="text-4xl md:text-6xl font-bold"
            style={{ textShadow: "0px 10px 15px rgba(0, 0, 0, 0.9)" }}
          >
            Meet Adventurers,{" "}
            <span className="text-yellow-400">Explore Together</span>
          </h1>
          <p
            className="mt-4 text-lg md:text-xl text-gray-200"
            style={{ textShadow: "0px 5px 10px rgba(0, 0, 0, 0.8)" }}
          >
            Find like-minded people to join you on your next adventure.
          </p>
        </section>

        <section className="relative w-full h-full flex justify-center items-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={staticAdventureList[currentIndex].id}
              initial={{ x: `${animationDirection * 100}%`, opacity: 1 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: `${-animationDirection * 100}%`, opacity: 1 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
              className="absolute w-full h-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${staticAdventureList[currentIndex].image})`,
              }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.0}
              onDragEnd={(event, info) => {
                if (info.offset.x < -50) handleSwipeStaticImages("right");
                else if (info.offset.x > 50) handleSwipeStaticImages("left");
              }}
            >
              <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white px-6">
                <h2
                  className="text-4xl font-bold"
                  style={{ textShadow: "0px 8px 12px rgba(0, 0, 0, 0.9)" }}
                >
                  {staticAdventureList[currentIndex].name}
                </h2>
                <p
                  className="text-lg"
                  style={{ textShadow: "0px 5px 10px rgba(0, 0, 0, 0.8)" }}
                >
                  {staticAdventureList[currentIndex].location}
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </section>
      </main>
    );
  }

  return (
    <main className="relative w-full h-screen overflow-hidden flex flex-col bg-black">
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 
        ${showMenu ? "translate-y-0" : "-translate-y-full"}`}
      >
        <Navbar onMenuToggle={handleMenuToggle} />
      </header>

      <section className="relative w-full h-full flex justify-center items-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={adventures[currentIndex]?.id}
            initial={{ x: `${animationDirection * 100}%`, opacity: 1 }}
            animate={{ x: "0%", opacity: 1 }}
            exit={{ x: `${-animationDirection * 100}%`, opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: `url(${adventures[currentIndex]?.profilePic})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "auto 100%",
              backgroundPosition: "center",
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.0}
            onDragEnd={(event, info) => {
              if (info.offset.x < -0.1) handleSwipe("right");
              else if (info.offset.x > 0.1) handleSwipe("left");
            }}
          >
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white px-6">
              <div className="flex flex-col items-center">
                <h2
                  className="text-4xl font-bold"
                  style={{ textShadow: "0px 8px 12px rgba(0, 0, 0, 0.9)" }}
                >
                  {adventures[currentIndex]?.name}
                </h2>
                <p
                  className="text-lg"
                  style={{ textShadow: "0px 5px 10px rgba(0, 0, 0, 0.8)" }}
                >
                  {adventures[currentIndex]?.location}{" "}
                </p>
                <p
                  className="text-lg"
                  style={{ textShadow: "0px 5px 10px rgba(0, 0, 0, 0.8)" }}
                >
                  {adventures[currentIndex]?.age}
                </p>
                <p
                  className="text-lg"
                  style={{ textShadow: "0px 5px 10px rgba(0, 0, 0, 0.8)" }}
                >
                  {adventures[currentIndex]?.bio}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </section>

      <div className="absolute bottom-16 w-full flex justify-center gap-6 z-10">
        <Button variant="outline" onClick={() => handleSwipe("left")}>
          Pass
        </Button>

        <Button onClick={() => handleSwipe("right")}>Match</Button>
      </div>
    </main>
  );
}
