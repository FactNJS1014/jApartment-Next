import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const {id} = await params
        await prisma.room.update({
            where: {
                id: id
            },
            data: {
                status: "inactive"
            }
        })
        return NextResponse.json({ message: "Room deleted successfully" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const {id} = await params
        await prisma.room.update({
            where: {
                id: id
            },
            data: {
                status: "active"
            }
        })
        return NextResponse.json({ message: "Room updated successfully" }, { status: 200 })
    } catch (error) {
        console.log(error)
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }
}

