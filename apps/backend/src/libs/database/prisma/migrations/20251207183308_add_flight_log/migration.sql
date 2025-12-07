-- CreateTable
CREATE TABLE "FlightLog" (
    "id" TEXT NOT NULL,
    "reservationId" TEXT NOT NULL,
    "flightsMinutes" INTEGER NOT NULL,
    "flightsCount" INTEGER NOT NULL,
    "publicComment" TEXT,
    "privateComment" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "FlightLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FlightLog_reservationId_key" ON "FlightLog"("reservationId");

-- AddForeignKey
ALTER TABLE "FlightLog" ADD CONSTRAINT "FlightLog_reservationId_fkey" FOREIGN KEY ("reservationId") REFERENCES "Reservation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
