/*
  Warnings:

  - You are about to drop the column `doonSensor` on the `RaspberrySlowEntry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "RaspberrySlowEntry" DROP COLUMN "doonSensor",
ADD COLUMN     "doorSensor" BOOLEAN;
