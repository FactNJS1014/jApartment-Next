import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

const updateBillSchema = z.object({
  paymentDate: z.string().optional(),
  status: z.string().optional(),
  lateFee: z.number().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const bill = await prisma.bill.findUnique({
      where: {
        id,
      },
      include: {
        room: true,
        booking: true,
        billItems: true,
      },
    });
    return NextResponse.json(bill);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch bill" },
      { status: 500 },
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updateBill = updateBillSchema.parse(body);
    const paymentDate = updateBill.paymentDate
      ? new Date(updateBill.paymentDate)
      : null;
    const bill = await prisma.bill.update({
      where: {
        id: id,
      },
      data: {
        paymentDate: paymentDate,
        status: updateBill.status || "",
        lateFee: updateBill.lateFee || 0,
      },
    });
    return NextResponse.json(bill);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update bill" },
      { status: 500 },
    );
  }
}
