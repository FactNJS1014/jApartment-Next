import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET() {
  try {
    const towerNames = await prisma.room.findMany({
      distinct: ["tolowerName"],
      select: {
        tolowerName: true,
      },
    });
    return NextResponse.json(towerNames);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to fetch tower names" },
      { status: 500 }
    );
  }
}
