-- AlterTable
ALTER TABLE "Pack" ADD COLUMN     "details" TEXT,
ADD COLUMN     "lastControlDate" TIMESTAMPTZ(3),
ADD COLUMN     "lastRescueFoldingDate" TIMESTAMPTZ(3);
