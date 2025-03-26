-- AlterTable
ALTER TABLE "User" ADD COLUMN     "adventureTypes" TEXT[],
ADD COLUMN     "attitude" TEXT[],
ADD COLUMN     "birthdate" TIMESTAMP(3),
ADD COLUMN     "languages" TEXT[],
ADD COLUMN     "profilePic" TEXT,
ADD COLUMN     "skillLevel" TEXT,
ADD COLUMN     "socialMedia" JSONB;
