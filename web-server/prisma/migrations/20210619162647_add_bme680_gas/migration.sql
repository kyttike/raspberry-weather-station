/*
  Warnings:

  - Added the required column `bme680Gas` to the `RaspberrySlowEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RaspberrySlowEntry" ADD COLUMN     "bme680Gas" DOUBLE PRECISION NOT NULL;
