-- CreateTable
CREATE TABLE "RaspberryEntry" (
    "id" SERIAL NOT NULL,
    "bme680Temperature" DOUBLE PRECISION NOT NULL,
    "bme680Pressure" DOUBLE PRECISION NOT NULL,
    "bme680Humidity" DOUBLE PRECISION NOT NULL,
    "windDirection" INTEGER NOT NULL,
    "windSpeed" DOUBLE PRECISION NOT NULL,
    "rainfall" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("id")
);
