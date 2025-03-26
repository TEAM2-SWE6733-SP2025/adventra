"use client";
import React from "react";
import Navbar from "../components/Navbar";
import Image from "next/image";

const teamMembers = [
  {
    name: "Kirsten Huttar",
    role: "Scrum Master",
    imageUrl: "",
  },
  {
    name: "John Pranoy Yalla",
    role: "Product Owner",
    imageUrl: "/profilepic.png",
  },
  {
    name: "Louis Muhammad",
    role: "Senior Developer",
    imageUrl: "/team-1.jpg",
  },
  {
    name: "Christopher Wilder",
    role: "Developer",
    imageUrl: "",
  },
  {
    name: "Prudhvi Samudrala",
    role: "Developer",
    imageUrl: "",
  },
  {
    name: "Yaswitha Swarna",
    role: "UI / Tester",
    imageUrl: "",
  },
];

const AboutPage = () => {
  return (
    <>
      <header className="block w-full">
        <Navbar />
      </header>
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-4xl w-full">
          <h1 className="text-4xl font-extrabold text-yellow-500 mb-8">
            Welcome to Adventra!
          </h1>
          <p className="text-lg dark:text-white text-gray-600 mb-12">
            At Adventra, we believe that life is best experienced through shared
            adventures. Whether you&#39;re into hiking, skiing, backpacking, or
            simply exploring new places, our platform connects like-minded
            adventurers. Our goal is to help you find your perfect adventure
            buddy — someone who matches your skills, preferences, and
            adventurous spirit.
          </p>
          <p className="text-lg dark:text-white text-gray-600 mb-12">
            With a passionate team led by experienced developers, product
            innovators, and design experts, we are committed to making every
            journey memorable. From planning your next escapade to capturing
            unforgettable moments, Adventra is your go-to travel companion.
          </p>
          <p className="text-lg dark:text-white text-gray-600 mb-12">
            Let’s embark on your next adventure together. Your story starts
            here.
          </p>

          <h2 className="text-4xl font-extrabold text-yellow-500 mb-8">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div
                key={index}
                className="p-6 dark rounded-2xl shadow-lg flex flex-col items-center"
              >
                {member.imageUrl ? (
                  <a
                    href={member.imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-yellow-500"
                      width={96}
                      height={96}
                    />
                  </a>
                ) : (
                  <div className="w-24 h-24 bg-yellow-500 text-black font-bold flex items-center justify-center rounded-full text-2xl mb-4">
                    {member.name.charAt(0)}
                  </div>
                )}
                <h2 className="text-xl font-semibold">{member.name}</h2>
                <p className="text-gray-400">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
