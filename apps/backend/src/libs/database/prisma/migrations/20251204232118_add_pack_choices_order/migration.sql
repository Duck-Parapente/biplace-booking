/*
  Warnings:

  - You are about to drop the `_PackToReservationWish` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."_PackToReservationWish" DROP CONSTRAINT "_PackToReservationWish_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_PackToReservationWish" DROP CONSTRAINT "_PackToReservationWish_B_fkey";

-- DropTable
DROP TABLE "public"."_PackToReservationWish";

-- CreateTable
CREATE TABLE "ReservationWishPackChoice" (
    "reservationWishId" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,

    CONSTRAINT "ReservationWishPackChoice_pkey" PRIMARY KEY ("reservationWishId","packId")
);

-- AddForeignKey
ALTER TABLE "ReservationWishPackChoice" ADD CONSTRAINT "ReservationWishPackChoice_reservationWishId_fkey" FOREIGN KEY ("reservationWishId") REFERENCES "ReservationWish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReservationWishPackChoice" ADD CONSTRAINT "ReservationWishPackChoice_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
