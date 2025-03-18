"use client";
import React, { useState } from "react";
import Link from "next/link";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    console.log("Menu toggle clicked. Current state:", !isOpen);
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-transparent hover:bg-white dark:hover:bg-black transition-colors duration-300 border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 w-full z-50 focus-within:bg-white dark:focus-within:bg-black">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold">
              Adventra
            </Link>
          </div>

          {/* Hamburger Menu */}
          <button
            onClick={handleClick}
            className="md:hidden text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100 cursor-pointer"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex space-x-12">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/profile">Profile</Link>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700`}
      >
        <div className="px-4 py-3 flex flex-col gap-4">
          <Link
            href="/"
            className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
          >
            About
          </Link>
          <Link
            href="/profile"
            className="text-gray-900 dark:text-gray-100 hover:text-gray-700 dark:hover:text-gray-300"
          >
            Profile
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
