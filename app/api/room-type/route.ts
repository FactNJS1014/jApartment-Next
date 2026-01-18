//GET /api/room-type
//POST /api/room-type

import { NextResponse } from "next/server";
import {prisma} from "@/libs/prisma";
import {z} from 'zod'


const roomTypeSchema = z.object({
    name: z.string(),
    price: z.number(),
    remark: z.string().optional()
})

export async function GET(){
    try {
        return NextResponse.json(
            await prisma.roomType.findMany({
                orderBy: {
                    createdAt: 'desc'
                },
                where: {
                    status: 'active'
                }
            })
        )
    } catch (error) {
        return NextResponse.json(
            {error: (error as Error).message},
            {status: 500}
        )
    }
}

export async function POST(request: Request){
    try {
        const body = await request.json();
        await prisma.roomType.create({
            data: roomTypeSchema.parse(body)
        })
        return NextResponse.json(
            {message: "Room type created successfully"},
            {status: 201}
        )
    } catch (error) {
        return NextResponse.json(
            {error: (error as Error).message},
            {status: 500}
        )
    }
}


