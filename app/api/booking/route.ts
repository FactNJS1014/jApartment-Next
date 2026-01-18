import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const schema = z.object({
      customerName: z.string(),
      customerPhone: z.string(),
      customerAddress: z.string(),
      cardId: z.string(),
      gender: z.string(),
      roomId: z.string(),
      remark: z.string().optional(),
      deposit: z.number().default(0),
      stayAt: z.string().transform((str) => new Date(str)),
      stayTo: z
        .string()
        .nullable()
        .optional()
        .transform((str) => (str ? new Date(str) : null)),
      electricityInt: z.number().default(0),
      waterInt: z.number().default(0),
    });
    const {
      customerName,
      customerPhone,
      customerAddress,
      cardId,
      gender,
      roomId,
      remark,
      deposit,
      stayAt,
      stayTo,
      electricityInt,
      waterInt,
    } = schema.parse(body);

    await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        statusEmpty: "no",
      },
    });

    const oldbooking = await prisma.booking.findFirst({
      where: {
        roomId: roomId,
        room: {
          statusEmpty: "no",
          status: "active",
        },
      },
    });

    let bookingId = "";

    if (oldbooking) {
      bookingId = oldbooking.id;
      await prisma.booking.update({
        where: {
          id: oldbooking.id,
        },
        data: {
          customerName: customerName,
          customerPhone: customerPhone,
          customerAddress: customerAddress,
          cardId: cardId,
          gender: gender,
          remark: remark,
          deposit: deposit,
          stayAt: stayAt,
          stayTo: stayTo,
        },
      });
    } else {
      await prisma.booking.create({
        data: {
          customerName: customerName,
          customerPhone: customerPhone,
          customerAddress: customerAddress,
          cardId: cardId,
          gender: gender,
          roomId: roomId,
          remark: remark,
          deposit: deposit,
          stayAt: new Date(),
          stayTo: new Date(),
          status: "active",
        },
      });
    }

    await prisma.room.update({
      where: {
        id: roomId,
      },
      data: {
        statusEmpty: "no",
      },
    });

    await updateUnitOfWaterAndElectricity(bookingId, electricityInt, waterInt);

    return NextResponse.json({ message: "Booking successfully" });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

const updateUnitOfWaterAndElectricity = async (
  bookingId: string,
  electricityInt: number,
  waterInt: number
) => {
  const oldWaterUnit = await prisma.waterlog.findFirst({
    where: {
      bookingId: bookingId,
      waterInt: waterInt,
    },
  });

  const oldElectricityUnit = await prisma.electricitylog.findFirst({
    where: {
      bookingId: bookingId,
      electricityInt: electricityInt,
    },
  });

  if (oldElectricityUnit) {
    await prisma.electricitylog.update({
      where: {
        id: oldElectricityUnit.id,
      },
      data: {
        electricityInt: electricityInt,
      },
    });
  } else {
    await prisma.electricitylog.create({
      data: {
        bookingId: bookingId,
        electricityInt: electricityInt,
      },
    });
  }

  if (oldWaterUnit) {
    await prisma.waterlog.update({
      where: {
        id: oldWaterUnit.id,
      },
      data: {
        waterInt: waterInt,
      },
    });
  } else {
    await prisma.waterlog.create({
      data: {
        bookingId: bookingId,
        waterInt: waterInt,
      },
    });
  }
};
