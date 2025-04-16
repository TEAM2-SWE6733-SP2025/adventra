-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "blockedBy" TEXT,
ADD COLUMN  "isBlocked" BOOLEAN NOT NULL DEFAULT false;
