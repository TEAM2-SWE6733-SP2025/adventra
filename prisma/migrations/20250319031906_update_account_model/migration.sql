-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "expires_at" INTEGER,
ADD COLUMN     "scope" TEXT,
ADD COLUMN     "token_type" TEXT;
