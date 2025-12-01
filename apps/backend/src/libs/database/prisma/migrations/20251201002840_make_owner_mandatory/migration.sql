/*
  Warnings:

  - Made the column `ownerId` on table `Pack` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "public"."Pack" DROP CONSTRAINT "Pack_ownerId_fkey";

-- AlterTable
ALTER TABLE "Pack" ALTER COLUMN "ownerId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Pack" ADD CONSTRAINT "Pack_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
