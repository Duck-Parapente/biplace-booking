-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activeUntil" TIMESTAMPTZ(3),
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false;
