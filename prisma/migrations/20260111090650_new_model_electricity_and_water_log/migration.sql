-- CreateTable
CREATE TABLE "Electricitylog" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "electricityInt" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Electricitylog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Waterlog" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "waterInt" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Waterlog_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Electricitylog" ADD CONSTRAINT "Electricitylog_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Waterlog" ADD CONSTRAINT "Waterlog_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
