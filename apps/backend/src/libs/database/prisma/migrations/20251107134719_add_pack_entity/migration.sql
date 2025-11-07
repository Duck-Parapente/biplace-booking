-- CreateTable
CREATE TABLE "Pack" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT,
    "label" TEXT NOT NULL,
    "flightsHours" INTEGER NOT NULL,
    "flightsCount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pack_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pack" ADD CONSTRAINT "Pack_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
