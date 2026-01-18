import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";
import { z } from "zod";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const schema = z.object({
      waterPricePerUnit: z.number(),
      electricityPricePerUnit: z.number(),
    });
    const validatedBody = schema.parse(body);
    const waterAndElectricityPrice =
      await prisma.waterAndElectricityPrice.update({
        where: {
          id: id,
        },
        data: validatedBody,
      });
    return NextResponse.json(waterAndElectricityPrice);
  } catch (error) {
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
