import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

const billSchema = z.object({
  roomId: z.string(),
  bookingId: z.string(),
  waterUnit: z.number(),
  electricityUnit: z.number(),
  waterPricePerUnit: z.number(),
  electricityPricePerUnit: z.number(),
  roomPrice: z.number(),
  additionalCost: z.array(
    z.object({
      name: z.string(),
      amount: z.number(),
    }),
  ),
});

export async function GET() {
  try {
    const bills = await prisma.bill.findMany({
      include: {
        room: true,
        booking: true,
        billItems: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(bills);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch bills" },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedBody = billSchema.parse(body);
    const currentMonth = new Date();
    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0,
    );

    const existingBill = await prisma.bill.findFirst({
      where: {
        roomId: validatedBody.roomId,
        bookingId: validatedBody.bookingId,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    });

    if (existingBill) {
      return NextResponse.json(
        { error: "Bill already exists for this month" },
        { status: 400 },
      );
    }

    const waterCost = validatedBody.waterUnit * validatedBody.waterPricePerUnit;
    const electricityCost =
      validatedBody.electricityUnit * validatedBody.electricityPricePerUnit;
    const addTotal = validatedBody.additionalCost.reduce(
      (total, item) => total + item.amount,
      0,
    );
    const total =
      validatedBody.roomPrice + waterCost + electricityCost + addTotal;

    const bill = await prisma.bill.create({
      data: {
        roomId: validatedBody.roomId,
        bookingId: validatedBody.bookingId,
        waterUnit: validatedBody.waterUnit,
        electricityUnit: validatedBody.electricityUnit,
        waterCost: waterCost,
        electricityCost: electricityCost,
        roomPrice: validatedBody.roomPrice,
        additionalCost: addTotal,
        totalAmount: total,
        status: "pending",
      },
      include: {
        room: true,
        booking: true,
      },
    });

    const billItems = [];

    billItems.push({
      billId: bill.id,
      name: "ค่าเช่าห้อง",
      amount: validatedBody.roomPrice,
      type: "room",
    });

    billItems.push({
      billId: bill.id,
      name: `ค่าไฟ (${validatedBody.electricityUnit} หน่วย x ${validatedBody.electricityPricePerUnit} บาท/หน่วย)`,
      amount: electricityCost,
      type: "electricity",
    });

    billItems.push({
      billId: bill.id,
      name: `ค่าน้ำ (${validatedBody.waterUnit} หน่วย x ${validatedBody.waterPricePerUnit} บาท/หน่วย)`,
      amount: waterCost,
      type: "water",
    });

    for (const item of validatedBody.additionalCost) {
      billItems.push({
        billId: bill.id,
        name: item.name,
        amount: item.amount,
        type: "additional",
      });
    }

    await prisma.billItem.createMany({
      data: billItems,
    });

    return NextResponse.json({
      message: "Bill created successfully",
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to create bill" },
      { status: 500 },
    );
  }
}
