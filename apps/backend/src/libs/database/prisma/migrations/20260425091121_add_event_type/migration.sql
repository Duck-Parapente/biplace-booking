-- CreateEnum
CREATE TYPE "ReservationEventType" AS ENUM ('TRAINING', 'CLASSIC');

-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "eventType" "ReservationEventType" NOT NULL DEFAULT 'TRAINING';
