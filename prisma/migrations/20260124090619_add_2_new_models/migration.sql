-- CreateTable
CREATE TABLE "RoomTransfer" (
    "id" TEXT NOT NULL,
    "fromRoomId" TEXT NOT NULL,
    "toRoomId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "transferDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT NOT NULL,
    "transferFee" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approveBy" TEXT,
    "approveAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RoomTransfer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoveOuts" (
    "id" TEXT NOT NULL,
    "roomId" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "moveOutDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reason" TEXT,
    "depositReturn" INTEGER NOT NULL DEFAULT 0,
    "outstandingFees" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "approveBy" TEXT,
    "approveAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MoveOuts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "RoomTransfer" ADD CONSTRAINT "RoomTransfer_fromRoomId_fkey" FOREIGN KEY ("fromRoomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTransfer" ADD CONSTRAINT "RoomTransfer_toRoomId_fkey" FOREIGN KEY ("toRoomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoomTransfer" ADD CONSTRAINT "RoomTransfer_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoveOuts" ADD CONSTRAINT "MoveOuts_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoveOuts" ADD CONSTRAINT "MoveOuts_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
