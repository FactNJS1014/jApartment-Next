import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const schema = z.object({
      tolowerName: z.string(),
      totalLevel: z.number(),
      totalRoom: z.number(),
      roomTypeId: z.string(),
    });
    const { roomTypeId, totalLevel, totalRoom, tolowerName } =
      schema.parse(body);
    const totalRoomNumber = Number(totalRoom);
    const totalLevelNumber = Number(totalLevel);

    if (totalRoomNumber > 0) {
      const computeTotalRoom = totalRoomNumber * totalLevelNumber;

      for (let i = 1; i <= totalLevelNumber; i++) {
        for (let j = 1; j <= totalRoomNumber; j++) {
          const roomNo = `${i}${String(j).padStart(2, "0")}`;
          const roomName = `${tolowerName}${roomNo}`;
          await prisma.room.create({
            data: {
              roomTypeId: roomTypeId,
              name: roomName,
              status: "active",
              statusEmpty: "empty",
              tolowerName: tolowerName,
              totalLevel: totalLevelNumber,
              totalRoom: computeTotalRoom,
            },
          });
        }
      }
    }
    return NextResponse.json(
      { message: "Room created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
