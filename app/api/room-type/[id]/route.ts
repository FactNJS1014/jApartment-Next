//GET /api/room-type/:id
//PUT /api/room-type/:id
//DELETE /api/room-type/:id

import { NextResponse } from "next/server";
import {prisma} from "@/libs/prisma";
import {z} from 'zod'



export async function GET(request: Request, {params}: { params:Promise<{id: string}>}
){
    try {
        const {id} = await params;
        const roomType = await prisma.roomType.findUnique({
            where: {
                id: id
            }
        })
        return NextResponse.json(
            roomType,
            {status: 200}
        )
    } catch (error) {
        return NextResponse.json(
            {error: (error as Error).message},
            {status: 500}
        )
    }
}

export async function PUT(request: Request, {params}: { params:Promise<{id: string}>}
){
    try {
      const formSchema = z.object({
        name: z.string(),
        price: z.number(),
        remark: z.string().optional()
      })
      const body = await request.json();
      const validatedBody = formSchema.parse(body);
      const {id} = await params;
      const roomType = await prisma.roomType.update({
        where: {
          id: id
        },
        data: validatedBody
      })
      return NextResponse.json(
        roomType,
        {status: 200}
      )
    } catch (error) {
        return NextResponse.json(
            {error: (error as Error).message},
            {status: 500}
        )
    }
}

export async function DELETE(request: Request, {params}: { params:Promise<{id: string}>}
){
    try {
        const {id} = await params;
        const roomType = await prisma.roomType.update({
            where: {
                id: id
            },
            data: {
                status: 'inactive'
            }
        })
        return NextResponse.json(
            roomType,
            {status: 200}
        )
    } catch (error) {
        return NextResponse.json(
            {error: (error as Error).message},
            {status: 500}
        )
    }
}