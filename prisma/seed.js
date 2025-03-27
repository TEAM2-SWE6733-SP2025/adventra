import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding the database...");

  // Create a user
  const user = await prisma.user.create({
    data: {
      id: "12345",
      name: "John Doe",
      bio: "Outdoor enthusiast who loves hiking and photography.",
      location: "Denver, CO",
      email: "johndoe@example.com",
      emailVerified: new Date(),
      image: "sj-pic.jpg",
      instagramLink: "https://instagram.com/johndoe",
      twitterLink: "https://twitter.com/johndoe",
      linkedInLink: "https://linkedin.com/in/johndoe",
      adventureTypes: ["Hiking", "Photography"],
      attitude: ["Adventurous", "Curious"],
      skillLevel: "Intermediate",
      languages: ["English", "Spanish"],
      birthdate: new Date("1990-05-15"),
      profilePic: "https://example.com/johndoe.jpg",
      socialMedia: {
        instagram: "https://instagram.com/johndoe",
        twitter: "https://twitter.com/johndoe",
        linkedin: "https://linkedin.com/in/johndoe",
      },
    },
  });

  console.log("User created:", user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
