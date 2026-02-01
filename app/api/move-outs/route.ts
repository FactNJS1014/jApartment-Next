import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

const moveOutSchema = z.object({
  roomsId: z.string(),
  bookingId: z.string(),
  moveOutDate: z.string().optional(),
  depositReturn: z.number().optional(),
  outstandingFees: z.number().optional(),
  reason: z.string().optional(),
});

export const GET = async () => {
  try {
    const moveOuts = await prisma.moveOuts.findMany({
      include: {
        room: {
          include: {
            roomType: true,
          },
        },
        booking: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(moveOuts);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const validatedData = moveOutSchema.parse(body);
    const moveOut = await prisma.moveOuts.create({
      data: {
        roomId: validatedData.roomsId,
        bookingId: validatedData.bookingId,
        moveOutDate: validatedData.moveOutDate,
        depositReturn: validatedData.depositReturn,
        outstandingFees: validatedData.outstandingFees,
        reason: validatedData.reason ?? "",
        status: "pending",
      },
    });
    return NextResponse.json(moveOut);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
