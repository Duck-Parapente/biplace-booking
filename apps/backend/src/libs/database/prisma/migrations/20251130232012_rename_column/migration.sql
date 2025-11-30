/*
  Warnings:

  - You are about to drop the column `createdById` on the `ReservationWish` table. All the data in the column will be lost.
  - Added the required column `userId` to the `ReservationWish` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."ReservationWish" DROP CONSTRAINT "ReservationWish_createdById_fkey";

-- AlterTable
ALTER TABLE "ReservationWish" RENAME COLUMN "createdById" TO "userId";

-- AddForeignKey
ALTER TABLE "ReservationWish" ADD CONSTRAINT "ReservationWish_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
