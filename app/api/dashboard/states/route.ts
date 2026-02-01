import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import dayjs from "dayjs";

export async function GET() {
  try {
    // 1. Total Stats
    // ห้องทั้งหมด
    const totalRooms = await prisma.room.count();

    // ห้องที่มีคนพัก
    const occupiedRoomsCount = await prisma.room.count({
      where: { statusEmpty: "no" },
    });

    // ห้องว่าง
    const emptyRoomsCount = totalRooms - occupiedRoomsCount;

    const totalGuests = await prisma.booking.count({
      where: { status: "active" },
    });

    // รายได้
    const totalRevenueResult = await prisma.bill.aggregate({
      where: { status: "paid" },
      _sum: { totalAmount: true },
    });
    const totalRevenue = totalRevenueResult._sum.totalAmount || 0;

    // 2. Room Occupancy Pie Chart
    const occupancyData = [
      { name: "มีผู้พัก", value: occupiedRoomsCount, color: "#3b82f6" },
      { name: "ห้องว่าง", value: emptyRoomsCount, color: "#94a3b8" },
    ];

    // 3. Room Type Donut Chart
    const roomTypes = await prisma.roomType.findMany({
      include: { _count: { select: { rooms: true } } },
    });
    const roomTypeData = roomTypes.map((rt) => ({
      name: rt.name,
      value: rt._count.rooms,
    }));

    // 4. Monthly Revenue Bar Chart (Last 6 Months)
    const sixMonthsAgo = dayjs().subtract(5, "month").startOf("month").toDate();
    const bills = await prisma.bill.findMany({
      where: {
        status: "paid",
        billDate: { gte: sixMonthsAgo },
      },
      select: { totalAmount: true, billDate: true },
    });
    const monthlyRevenueMap: Record<string, number> = {};

    for (let i = 0; i < 6; i++) {
      const month = dayjs().subtract(i, "month").format("MMM YY");
      monthlyRevenueMap[month] = 0;
    }

    bills.forEach((bill) => {
      const month = dayjs(bill.billDate).format("MMM YY");

      if (monthlyRevenueMap[month] !== undefined) {
        monthlyRevenueMap[month] += bill.totalAmount;
      }
    });

    const monthlyRevenueData = Object.entries(monthlyRevenueMap)
      .map(([month, amount]) => ({ month, amount }))
      .reverse();

    // 5. Gender Distribution (Donut or Pie)
    const maleCount = await prisma.booking.count({ where: { gender: "male" } });
    const femaleCount = await prisma.booking.count({
      where: { gender: "female" },
    });
    const genderData = [
      { name: "ชาย", value: maleCount, color: "#60a5fa" },
      { name: "หญิง", value: femaleCount, color: "#f472b6" },
    ];

    // Response to Client
    return NextResponse.json({
      summary: {
        totalRooms,
        occupiedRooms: occupiedRoomsCount,
        emptyRooms: emptyRoomsCount,
        totalGuests,
        totalRevenue,
      },
      occupancyData,
      roomTypeData,
      monthlyRevenueData,
      genderData,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 },
    );
  }
}
