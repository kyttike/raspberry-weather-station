/*
  Warnings:

  - Added the required column `deletedAt` to the `RaspberryEntry` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RaspberryEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RaspberryEntry" ADD COLUMN     "deletedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
