import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const room = await prisma.room.findUnique({
      where: {
        id: id,
      },
      include: {
        roomType: true,
        bookings: {
          include: {
            waterlog: {
              orderBy: {
                createdAt: "desc",
              },
              take: 1,
            },
            electricitylog: {
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
    return NextResponse.json(room, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.room.update({
      where: {
        id: id,
      },
      data: {
        status: "inactive",
      },
    });
    return NextResponse.json(
      { message: "Room deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await prisma.room.update({
      where: {
        id: id,
      },
      data: {
        status: "active",
      },
    });
    return NextResponse.json(
      { message: "Room updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
