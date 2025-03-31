import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      id: "12345",
      name: "John Doe",
      bio: "Outdoor enthusiast who loves hiking and photography.",
      location: "Denver, CO",
      email: "johndoe@example.com",
      emailVerified: new Date(),
      image: "sj-pic.jpg",
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
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
