/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `RaspberryFastEntry` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `RaspberrySlowEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RaspberryFastEntry" DROP COLUMN "updatedAt";

-- AlterTable
ALTER TABLE "RaspberrySlowEntry" DROP COLUMN "updatedAt";
