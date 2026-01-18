import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { roomTypeId: string } }
) {
  try {
    const { roomTypeId } = await params;
    const rooms = await prisma.room.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        roomType: true,
        bookings: {
          include: {
            electricitylog: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
            waterlog: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      where: {
        roomTypeId: roomTypeId,
      },
    });
    console.log(rooms);
    return NextResponse.json(rooms);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
