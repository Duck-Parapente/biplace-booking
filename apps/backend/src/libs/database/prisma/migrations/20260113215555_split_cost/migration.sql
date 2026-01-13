/*
  Warnings:

  - You are about to drop the column `cost` on the `Reservation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "cost",
ADD COLUMN     "automaticCost" INTEGER,
ADD COLUMN     "manualCost" INTEGER;
