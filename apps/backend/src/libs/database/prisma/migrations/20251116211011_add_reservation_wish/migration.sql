-- CreateTable
CREATE TABLE "ReservationWish" (
    "id" TEXT NOT NULL,
    "startingDate" TIMESTAMP(3) NOT NULL,
    "endingDate" TIMESTAMP(3) NOT NULL,
    "publicComment" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReservationWish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PackToReservationWish" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PackToReservationWish_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PackToReservationWish_B_index" ON "_PackToReservationWish"("B");

-- AddForeignKey
ALTER TABLE "ReservationWish" ADD CONSTRAINT "ReservationWish_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackToReservationWish" ADD CONSTRAINT "_PackToReservationWish_A_fkey" FOREIGN KEY ("A") REFERENCES "Pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PackToReservationWish" ADD CONSTRAINT "_PackToReservationWish_B_fkey" FOREIGN KEY ("B") REFERENCES "ReservationWish"("id") ON DELETE CASCADE ON UPDATE CASCADE;
