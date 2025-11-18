-- CreateEnum
CREATE TYPE "ReservationWishStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- AlterTable
ALTER TABLE "ReservationWish" ADD COLUMN     "status" "ReservationWishStatus" NOT NULL DEFAULT 'PENDING';
