/*
  Warnings:

  - A unique constraint covering the columns `[reservationWishId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Reservation_reservationWishId_key" ON "Reservation"("reservationWishId");
