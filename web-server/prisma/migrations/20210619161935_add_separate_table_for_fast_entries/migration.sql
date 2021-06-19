/*
  Warnings:

  - You are about to drop the `RaspberryEntry` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "RaspberryEntry";

-- CreateTable
CREATE TABLE "RaspberrySlowEntry" (
    "id" SERIAL NOT NULL,
    "bme680Temperature" DOUBLE PRECISION NOT NULL,
    "bme680Pressure" DOUBLE PRECISION NOT NULL,
    "bme680Humidity" DOUBLE PRECISION NOT NULL,
    "rainfall" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RaspberryFastEntry" (
    "id" SERIAL NOT NULL,
    "windDirection" INTEGER NOT NULL,
    "windSpeed" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    PRIMARY KEY ("id")
);
