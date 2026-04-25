/*
  Warnings:

  - You are about to drop the column `eventType` on the `Reservation` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ReservationContext" AS ENUM ('TRAINING', 'CLASSIC');

-- AlterTable
ALTER TABLE "Reservation" DROP COLUMN "eventType",
ADD COLUMN     "context" "ReservationContext" NOT NULL DEFAULT 'CLASSIC';

-- DropEnum
DROP TYPE "public"."ReservationEventType";
