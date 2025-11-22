-- AlterTable
ALTER TABLE "Pack" ALTER COLUMN "createdAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ReservationWish" ALTER COLUMN "createdAt" DROP DEFAULT,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "currentScore" DROP DEFAULT,
ALTER COLUMN "createdAt" DROP DEFAULT;

-- CreateTable
CREATE TABLE "Reservation" (
    "id" TEXT NOT NULL,
    "startingDate" TIMESTAMP(3) NOT NULL,
    "endingDate" TIMESTAMP(3) NOT NULL,
    "packId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "publicComment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "reservationWishId" TEXT,

    CONSTRAINT "Reservation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reservation" ADD CONSTRAINT "Reservation_reservationWishId_fkey" FOREIGN KEY ("reservationWishId") REFERENCES "ReservationWish"("id") ON DELETE SET NULL ON UPDATE CASCADE;
