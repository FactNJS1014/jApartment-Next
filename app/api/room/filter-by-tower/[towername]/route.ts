import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ towername: string }> }
) {
  try {
    const { towername } = await params;
    const rooms = await prisma.room.findMany({
      where: {
        tolowerName: towername,
      },
      orderBy: {
        name: "asc",
      },
      include: {
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
    });
    return NextResponse.json(rooms);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
