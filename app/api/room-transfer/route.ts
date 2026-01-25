//GET api/room-transfer
//POST api/room-transfer

import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/libs/prisma";

const roomTransferSchema = z.object({
  fromRoomId: z.string(),
  toRoomId: z.string(),
  bookingId: z.string(),
  transferDate: z.string().optional(),
  transferFee: z.number().optional(),
  reason: z.string().optional(),
});

export async function GET() {
  try {
    const transfer = await prisma.roomTransfer.findMany({
      include: {
        fromRoom: {
          include: {
            roomType: true,
          },
        },
        toRoom: {
          include: {
            roomType: true,
          },
        },
        booking: true,
      },
    });
    return NextResponse.json(transfer);
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedBody = roomTransferSchema.parse(body);
    const transfer = await prisma.roomTransfer.create({
      data: {
        fromRoomId: validatedBody.fromRoomId,
        toRoomId: validatedBody.toRoomId,
        bookingId: validatedBody.bookingId,
        transferDate: validatedBody.transferDate
          ? new Date(validatedBody.transferDate)
          : new Date(),
        transferFee: validatedBody.transferFee,
        reason: validatedBody.reason ?? "",
        status: "pending",
      },
    });
    return NextResponse.json(transfer);
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
