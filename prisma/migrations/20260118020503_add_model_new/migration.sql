-- CreateTable
CREATE TABLE "WaterAndElectricityPrice" (
    "id" TEXT NOT NULL,
    "waterPricePerUnit" INTEGER NOT NULL,
    "electricityPricePerUnit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WaterAndElectricityPrice_pkey" PRIMARY KEY ("id")
);
