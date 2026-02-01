//PUT api/room-transfer/:id
//DELETE api/room-transfer/:id

import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

const roomTransferSchema = z.object({
  status: z.string(),
  approveBy: z.string().optional(),
  approveAt: z.string().optional(),
  transferFee: z.number().optional(),
  reason: z.string().optional(),
});

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();
    const { id } = await params;
    const validatedBody = roomTransferSchema.parse(body);
    const transfer = await prisma.roomTransfer.findUnique({
      where: {
        id: id,
      },
    });
    if (!transfer) {
      return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
    }

    if (
      validatedBody.status === "completed" &&
      transfer.status !== "completed"
    ) {
      const result = await prisma.$transaction(async (tx) => {
        await tx.room.update({
          where: {
            id: transfer.fromRoomId,
          },
          data: {
            statusEmpty: "yes",
          },
        });
        await tx.room.update({
          where: {
            id: transfer.toRoomId,
          },
          data: {
            statusEmpty: "no",
          },
        });
        await tx.booking.update({
          where: {
            id: transfer.bookingId,
          },
          data: {
            roomId: transfer.toRoomId,
          },
        });

        await tx.roomTransfer.update({
          where: {
            id: id,
          },
          data: {
            status: "completed",
            approveAt: new Date(),
            reason: validatedBody.reason,
            transferFee: validatedBody.transferFee,
          },
        });
      });
      return NextResponse.json({});
    }
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const transfer = await prisma.roomTransfer.findUnique({
      where: {
        id: id,
      },
    });
    if (!transfer) {
      return NextResponse.json({ error: "ไม่พบข้อมูล" }, { status: 404 });
    }
    await prisma.$transaction(async (tx) => {
      if (transfer.status === "completed") {
        await tx.room.update({
          where: {
            id: transfer.fromRoomId,
          },
          data: {
            statusEmpty: "no",
          },
        });
        await tx.room.update({
          where: {
            id: transfer.toRoomId,
          },
          data: {
            statusEmpty: "empty",
          },
        });
        await tx.booking.update({
          where: {
            id: transfer.bookingId,
          },
          data: {
            roomId: transfer.fromRoomId,
          },
        });
        await tx.roomTransfer.delete({
          where: {
            id: id,
          },
        });
      }
    });
    return NextResponse.json({});
  } catch (error) {
    return NextResponse.json({ error: "เกิดข้อผิดพลาด" }, { status: 500 });
  }
}
