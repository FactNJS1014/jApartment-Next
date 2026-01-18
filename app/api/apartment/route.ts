//GET /api/apartment
//POST /api/apartment
export const runtime = "nodejs";

import {prisma} from "@/libs/prisma";
import { NextResponse } from "next/server";
import  {z} from "zod";

const apartmentSchema = z.object({
    name: z.string(),
    address: z.string(),
    phone: z.string(),
    email: z.string().optional(),
    lineId: z.string().optional(),
    taxCode: z.string(),
})

export async function GET() {
    try{
        
        return NextResponse.json(
            await prisma.apartment.findFirst() ?? {},
            {status: 200}
        );
    }catch(error){
        console.log(error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}

export async function POST(request: Request) {
    try{
        const body = await request.json();
        const oldApartment = await prisma.apartment.findFirst();
        if(oldApartment){
            await prisma.apartment.update({
                where: {
                    id: oldApartment.id,
                },
                data: apartmentSchema.parse(body),
            });
            return NextResponse.json(oldApartment, {status: 200});
        }
        const apartment = await prisma.apartment.create({
            data: apartmentSchema.parse(body),
        });
        return NextResponse.json(apartment, {status: 201});
    }catch(error){
        console.log(error);
        return NextResponse.json({error: "Internal Server Error"}, {status: 500});
    }
}