"use client";
import React, { useState } from "react";
import Link from "next/link";
import AuthButton from "./AuthButton";
import { useSession } from "next-auth/react";

export const Navbar = ({ onMenuToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const handleClick = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onMenuToggle) {
      onMenuToggle(newState);
    }
  };

  return (
    <nav className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-700 w-full">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold">
              Adventra
            </Link>
          </div>

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

          <div className="hidden md:flex space-x-12 items-center">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            {session && <Link href="/chat-client">Chats</Link>}
            {session && <Link href="/profile">Profile</Link>} <AuthButton />
          </div>
        </div>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } bg-white dark:bg-black border-t border-gray-200 dark:border-gray-700`}
      >
        <div className="px-4 py-3 flex flex-col gap-4">
          <Link href="/">Home</Link>
          <Link href="/about">About</Link>
          {session && <Link href="/chat-client">Chats</Link>}
          {session && <Link href="/profile">Profile</Link>} <AuthButton />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
