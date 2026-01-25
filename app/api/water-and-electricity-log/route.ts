import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const schema = z.object({
      roomName: z.string(),
      waterMeter: z.number(),
      electricityMeter: z.number(),
    });
    const { roomName, waterMeter, electricityMeter } = schema.parse(payload);
    const room = await prisma.room.findFirst({
      where: {
        name: roomName,
        status: "active",
      },
    });
    const booking = await prisma.booking.findFirst({
      where: {
        roomId: room?.id,
        status: "active",
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 1,
    });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    const oldWaterPrice = await prisma.waterlog.findFirst({
      where: {
        bookingId: booking?.id,
        waterInt: waterMeter,
      },
    });

    const oldElectricityPrice = await prisma.electricitylog.findFirst({
      where: {
        bookingId: booking?.id,
        electricityInt: electricityMeter,
      },
    });

    if (!oldWaterPrice) {
      await prisma.waterlog.create({
        data: {
          bookingId: booking?.id ?? "",
          waterInt: waterMeter,
        },
      });
    }

    if (!oldElectricityPrice) {
      await prisma.electricitylog.create({
        data: {
          bookingId: booking?.id ?? "",
          electricityInt: electricityMeter,
        },
      });
    }
    return NextResponse.json({
      message: "Water and electricity log created successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create water and electricity log" },
      { status: 500 }
    );
  }
}
