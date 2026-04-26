-- CreateTable
CREATE TABLE "PackNote" (
    "id" TEXT NOT NULL,
    "packId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL,
    "createdById" TEXT NOT NULL,

    CONSTRAINT "PackNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PackNote" ADD CONSTRAINT "PackNote_packId_fkey" FOREIGN KEY ("packId") REFERENCES "Pack"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PackNote" ADD CONSTRAINT "PackNote_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
