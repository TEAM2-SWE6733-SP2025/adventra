/*
  Warnings:

  - You are about to drop the column `instagramLink` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `linkedInLink` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twitterLink` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "instagramLink",
DROP COLUMN "linkedInLink",
DROP COLUMN "twitterLink";
