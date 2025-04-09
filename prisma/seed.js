/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Test12345!", 10);

  const users = [
    {
      id: "1",
      name: "John Doe",
      bio: "Outdoor enthusiast who loves hiking and photography.",
      email: "john@example.com",
      gender: "Male",
      latitude: 33.749,
      longitude: -84.388,
      state: "GA",
      city: "Atlanta",
      adventureTypes: ["Hiking", "Photography"],
      attitude: ["Adventurous", "Curious"],
      skillLevel: "Intermediate",
      languages: ["English", "Spanish"],
      birthdate: new Date("1990-05-15"),
    },
    {
      id: "2",
      name: "Jane Smith",
      bio: "Nature lover and avid camper.",
      email: "jane@example.com",
      gender: "Female",
      latitude: 33.7537,
      longitude: -84.3863,
      state: "GA",
      city: "Atlanta",
      adventureTypes: ["Camping", "Kayaking"],
      attitude: ["Easy-Going", "Optimistic"],
      skillLevel: "Beginner",
      languages: ["English"],
      birthdate: new Date("1995-08-20"),
    },
    {
      id: "3",
      name: "Michael Johnson",
      bio: "Cycling enthusiast and adventure seeker.",
      email: "michael@example.com",
      gender: "Male",
      latitude: 33.7488,
      longitude: -84.39,
      state: "GA",
      city: "Atlanta",
      adventureTypes: ["Cycling", "Climbing"],
      attitude: ["Energetic", "Bold"],
      skillLevel: "Advanced",
      languages: ["English", "French"],
      birthdate: new Date("1988-03-10"),
    },
    {
      id: "4",
      name: "Emily Davis",
      bio: "Loves kayaking and exploring new trails.",
      email: "emily@example.com",
      gender: "Female",
      latitude: 33.7516,
      longitude: -84.3915,
      state: "GA",
      city: "Atlanta",
      adventureTypes: ["Kayaking", "Hiking"],
      attitude: ["Open-Minded", "Resilient"],
      skillLevel: "Intermediate",
      languages: ["English", "German"],
      birthdate: new Date("1992-11-05"),
    },
    {
      id: "5",
      name: "Chris Brown",
      bio: "Rock climber and outdoor photographer.",
      email: "chris@example.com",
      gender: "Male",
      latitude: 33.752,
      longitude: -84.3879,
      state: "GA",
      city: "Atlanta",
      adventureTypes: ["Climbing", "Photography"],
      attitude: ["Fearless", "Independent"],
      skillLevel: "Expert",
      languages: ["English", "Italian"],
      birthdate: new Date("1985-07-25"),
    },
    {
      id: "6",
      name: "Sarah Wilson",
      bio: "Passionate about rafting and nature photography.",
      email: "sarah@example.com",
      gender: "Female",
      latitude: 33.754,
      longitude: -84.389,
      state: "GA",
      city: "Atlanta",
      adventureTypes: ["Rafting", "Camping"],
      attitude: ["Social", "Flexible"],
      skillLevel: "Beginner",
      languages: ["English", "Spanish"],
      birthdate: new Date("1998-02-14"),
    },
    {
      id: "7",
      name: "David Martinez",
      bio: "Enjoys zip-lining and camping in the wild.",
      email: "david@example.com",
      gender: "Male",
      latitude: 33.75,
      longitude: -84.385,
      state: "GA",
      city: "Atlanta",
      adventureTypes: ["Zip-lining", "Camping"],
      attitude: ["Free-Spirited", "Optimistic"],
      skillLevel: "Intermediate",
      languages: ["English", "Portuguese"],
      birthdate: new Date("1993-06-18"),
    },
    {
      id: "8",
      name: "Laura Garcia",
      bio: "Hiking enthusiast and bird watcher.",
      email: "laura@example.com",
      gender: "Female",
      latitude: 33.7495,
      longitude: -84.3885,
      state: "GA",
      city: "Atlanta",
      adventureTypes: ["Hiking", "Bird Watching"],
      attitude: ["Nature-Loving", "Curious"],
      skillLevel: "Advanced",
      languages: ["English", "Spanish"],
      birthdate: new Date("1989-09-12"),
    },
    {
      id: "9",
      name: "James Anderson",
      bio: "Loves skiing and exploring mountain trails.",
      email: "james@example.com",
      gender: "Male",
      latitude: 33.7485,
      longitude: -84.3895,
      state: "GA",
      city: "Atlanta",
      adventureTypes: ["Skiing", "Hiking"],
      attitude: ["Bold", "Energetic"],
      skillLevel: "Expert",
      languages: ["English", "Russian"],
      birthdate: new Date("1987-12-01"),
    },
    {
      id: "10",
      name: "Olivia Thomas",
      bio: "Passionate about surfing and beach adventures.",
      email: "olivia@example.com",
      gender: "Female",
      latitude: 33.7505,
      longitude: -84.3865,
      state: "GA",
      city: "Atlanta",
      adventureTypes: ["Surfing", "Camping"],
      attitude: ["Adventurous", "Free-Spirited"],
      skillLevel: "Intermediate",
      languages: ["English", "French"],
      birthdate: new Date("1994-04-22"),
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: {
        ...user,
        emailVerified: new Date(),
        password: hashedPassword,
        image: `https://example.com/${user.name.toLowerCase().replace(" ", "")}.jpg`,
        profilePic: `https://example.com/${user.name.toLowerCase().replace(" ", "")}-profile.jpg`,
        socialMedia: {
          instagram: `https://instagram.com/${user.name.toLowerCase().replace(" ", "")}`,
          twitter: `https://twitter.com/${user.name.toLowerCase().replace(" ", "")}`,
        },
      },
    });
  }

  console.log("10 users have been seeded successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding the database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
