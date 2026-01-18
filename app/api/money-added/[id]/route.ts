import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/libs/prisma";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const schema = z.object({
      name: z.string(),
      amount: z.number(),
    });
    const { name, amount } = schema.parse(body);
    const moneyAdded = await prisma.moneyAdd.update({
      where: {
        id: (await params).id,
      },
      data: {
        name: name,
        amount: amount,
        status: "active",
      },
    });
    return NextResponse.json(moneyAdded);
  } catch (error) {
    return NextResponse.json(
      { error: "Error updating money added" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const moneyAdded = await prisma.moneyAdd.update({
      where: {
        id: (await params).id,
      },
      data: {
        status: "inactive",
      },
    });
    return NextResponse.json(moneyAdded);
  } catch (error) {
    return NextResponse.json(
      { error: "Error deleting money added" },
      { status: 500 }
    );
  }
}
