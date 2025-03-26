/*
  Warnings:

  - The `adventureTypes` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `attitude` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `languages` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "adventureTypes",
ADD COLUMN     "adventureTypes" JSONB,
DROP COLUMN "attitude",
ADD COLUMN     "attitude" JSONB,
DROP COLUMN "languages",
ADD COLUMN     "languages" JSONB;
