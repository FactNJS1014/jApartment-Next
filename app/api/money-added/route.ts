import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const moneyAdded = await prisma.moneyAdd.findMany({
      orderBy: {
        createdAt: "desc",
      },
      where: {
        status: "active",
      },
    });
    return NextResponse.json(moneyAdded);
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching money added" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const schema = z.object({
      name: z.string(),
      amount: z.number(),
    });
    const { name, amount } = schema.parse(body);
    const moneyAdded = await prisma.moneyAdd.create({
      data: {
        name: name,
        amount: amount,
        status: "active",
      },
    });
    return NextResponse.json(moneyAdded);
  } catch (error) {
    return NextResponse.json({ error: "Error adding money" }, { status: 500 });
  }
}
