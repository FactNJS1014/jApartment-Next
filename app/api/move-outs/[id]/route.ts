import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

const moveOutSchema = z.object({
  status: z.string().optional(),
  approveAt: z.string().optional(),
  depositReturn: z.number().optional(),
  outstandingFees: z.number().optional(),
  reason: z.string().optional(),
});

export const PUT = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const { id } = await params;
    const body = await req.json();
    const validatedData = moveOutSchema.parse(body);
    const moveOut = await prisma.moveOuts.findUnique({
      where: {
        id: id,
      },
    });
    if (!moveOut) {
      return NextResponse.json(
        { error: "Move Out not found" },
        { status: 404 },
      );
    }

    if (moveOut.status === "pending") {
      await prisma.$transaction(async (tx) => {
        await tx.room.update({
          where: {
            id: moveOut.roomId,
          },
          data: {
            statusEmpty: "empty",
          },
        });
        await tx.moveOuts.update({
          where: {
            id: id,
          },
          data: {
            status: validatedData.status,
            approveAt: new Date(),
            depositReturn: validatedData.depositReturn,
            outstandingFees: validatedData.outstandingFees,
            reason: validatedData.reason,
          },
        });
      });
    }
    return NextResponse.json({ message: "Move Out updated successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: { id: string } },
) => {
  try {
    const { id } = await params;
    const moveOut = await prisma.moveOuts.findUnique({
      where: {
        id: id,
      },
    });
    if (!moveOut) {
      return NextResponse.json(
        { error: "Move Out not found" },
        { status: 404 },
      );
    }
    await prisma.$transaction(async (tx) => {
      await tx.room.update({
        where: {
          id: moveOut.roomId,
        },
        data: {
          statusEmpty: "no",
        },
      });
      await tx.moveOuts.delete({
        where: {
          id: id,
        },
      });
    });
    return NextResponse.json({ message: "Move Out deleted successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
};
