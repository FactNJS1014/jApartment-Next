"use client";

import { RoomInterface } from "@/interface/RoomInterface";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { MoneyAddedInterface } from "@/interface/MoneyAddedInterface";

const currentMonth = new Date().toLocaleDateString("th-TH", {
  month: "long",
  year: "numeric",
});

interface Apartment {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  lineId: string;
  taxCode: string;
  createdAt: string;
  updatedAt: string;
}

interface WaterAndElectricityPrice {
  id: string;
  waterPricePerUnit: number;
  electricityPricePerUnit: number;
}

export default function ReceiptPage() {
  const params = useParams();
  const roomId = params?.roomId || "";
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [prices, setPrices] = useState<WaterAndElectricityPrice | null>(null);
  const [room, setRoom] = useState<RoomInterface | null>(null);
  const [moneyAdd, setMoneyAdd] = useState<MoneyAddedInterface[]>([]);

  useEffect(() => {
    fetchApartment();
    fetchPrices();
    fetchRoom();
    fetchMoneyAdd();
  }, []);

  const fetchApartment = async () => {
    try {
      const res = await axios.get("/api/apartment");
      setApartment(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPrices = async () => {
    try {
      const res = await axios.get("/api/water-and-electricity-price");
      setPrices(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoom = async () => {
    try {
      const res = await axios.get("/api/room/" + roomId);
      setRoom(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchMoneyAdd = async () => {
    try {
      const res = await axios.get("/api/money-added");
      setMoneyAdd(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const calculateWaterCost = () => {
    if (!room?.bookings?.[0]?.waterlog?.[0] || !prices) return 0;
    const currentWaterInt = room.bookings[0].waterlog[0].waterInt;
    return currentWaterInt * prices.waterPricePerUnit;
  };

  const calculateElectricityCost = () => {
    if (!room?.bookings?.[0]?.electricitylog?.[0] || !prices) return 0;
    const currentElectricityInt =
      room.bookings[0].electricitylog[0].electricityInt;
    return currentElectricityInt * prices.electricityPricePerUnit;
  };

  const calculateTotalCost = () => {
    const roomPrice = room?.roomType?.price || 0;
    const waterCost = calculateWaterCost();
    const electricityCost = calculateElectricityCost();
    const moneyAddTotal = moneyAdd.reduce(
      (total, item) => total + item.amount,
      0,
    );

    return roomPrice + waterCost + electricityCost + moneyAddTotal;
  };

  async function printDiv() {
    try {
      const payload = {
        roomId: roomId,
        bookingId: room?.bookings?.[0].id || "",
        waterUnit: room?.bookings?.[0]?.waterlog?.[0]?.waterInt || 0,
        electricityUnit:
          room?.bookings?.[0]?.electricitylog?.[0]?.electricityInt || 0,
        waterPricePerUnit: prices?.waterPricePerUnit || 0,
        electricityPricePerUnit: prices?.electricityPricePerUnit || 0,
        roomPrice: room?.roomType?.price || 0,
        additionalCost: moneyAdd.map((item) => {
          return {
            name: item.name,
            amount: item.amount,
          };
        }),
      };

      const res = await axios.post("/api/bills", payload);

      if (!res.data) {
        throw new Error("Failed to create bill");
      }

      console.log(res.data);
    } catch (error) {
      console.log(error);
    }

    const content = document.getElementById("page")?.innerHTML;
    if (!content) return;

    const win = window.open("", "", "width: 900, height: 1200");
    if (!win) return;

    win.document.write(`
            <!DOCTYPE html>
            <html lang="th">
                <head>
                    <meta charset="UTF-8">
                    <title>ใบแจ้งค่าเช่า</title>
                    <style>
                        @import url('https://fonts.googlepis.com/css2?family=Sarabun:wght@400;600;700&display=swap');
                        body {
                            font-family: 'Sarabun', Arial, sans-serif;
                            margin: 0;
                            padding: 0;
                            background: #f4f4f4;
                            color: #222;
                        }

                        .receipt-container {
                            width: 210mm;
                            min-height: 297mm;
                            margin: 0 auto;
                            padding: 20mm;
                            background: #fff;
                            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
                            box-sizing: border-box;
                        }

                        header {
                            padding: 20px;
                            padding-right: 0px;
                            border-radius: 8px 8px 0 0;
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 20px;
                        }

                        header h1 {
                            margin: 0;
                            font-size: 22px;
                        }

                        .apartment-info p {
                            margin: 2px 0;
                            font-size: 14px;
                            line-height: 1.4;
                        }

                        .info {
                            display: flex;
                            justify-content: space-between;
                            margin-bottom: 20px;
                            font-size: 14px;
                        }

                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-bottom: 20px;
                            font-size: 14px;
                        }

                        table th, table td {
                            border: 1px solid #333;
                            padding: 10px; 
                        }

                        table th {
                            background-color: #e9ecef;
                            font-weight: 700;
                            text-align: left;
                        }

                        table tbody tr:nth-child(even) {
                            background-color: #f9f9fa;
                        }

                        table tfoot th, table tfoot td {
                            background-color: #dee2e6;
                            font-weight: 700;
                            font-size: 15px;
                        }

                        .text-right {
                            text-align: right;
                        }

                        footer {
                            display: flex;
                            justify-content: space-between;
                            margin-top: 50px;
                            font-size: 14px;
                        }

                        .sign {
                            width: 200px;
                            text-align: center;
                            border-top: 1px solid #000;
                            padding-top: 6px;
                            margin-top: 40px;
                        }

                        @page {
                            size: A4;
                            margin: 0;
                        }
                    </style>
                </head>
                <body onload="window.print()">
                    <div class="receive-container">
                        ${content}

                        
                    </div>
                </body>
               
            </html>
        `);

    win.document.close();
  }

  return (
    <div className="min-h-screen py-8">
      <div
        id="page"
        className="receipt-container bg-white p-6 mx-auto shadow-lg rounded-lg"
        style={{ width: "794px" }}
      >
        <header>
          <h1>
            <strong>ใบแจ้งค่าเช่า / ใบเสร็จรับเงิน</strong>
          </h1>
          <div className="apartment-info text-right">
            <p>
              <strong>หอพัก : </strong>
              {apartment?.name}
            </p>
            <p>ที่อยู่ :{apartment?.address}</p>
            <p>โทร :{apartment?.phone}</p>
            <p>อีเมล :{apartment?.email}</p>
            <p>LINE ID :{apartment?.lineId}</p>
            <p>เลขประจําตัวผู้เสียภาษี :{apartment?.taxCode}</p>
          </div>
        </header>
        <section className="info">
          <div>
            <p>
              <strong>ผู้เช่า </strong>
              {room?.bookings?.[0]?.customerName}
            </p>
            <p>
              <strong>ห้อง </strong>
              {room?.name}
            </p>
          </div>
          <div>
            <p>
              <strong>เดือน </strong>
              {currentMonth}
            </p>
          </div>
        </section>
        <table className="table mt-3">
          <thead>
            <tr>
              <th>รายการ</th>
              <th>จำนวน</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>ค่าเช่า</td>
              <td className="text-right">
                {room?.roomType?.price.toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
            <tr>
              <td>
                ค่าไฟ ( {room?.bookings[0]?.electricitylog[0].electricityInt}{" "}
                หน่วย x {prices?.electricityPricePerUnit} บาท)
              </td>
              <td className="text-right">
                {calculateElectricityCost().toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
            <tr>
              <td>
                ค่าน้ำ ( {room?.bookings[0]?.waterlog[0].waterInt} หน่วย x{" "}
                {prices?.waterPricePerUnit} บาท)
              </td>
              <td className="text-right">
                {calculateWaterCost().toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </td>
            </tr>
            {moneyAdd.map((item) => (
              <tr>
                <td>{item.name}</td>
                <td className="text-right">
                  {item.amount.toLocaleString("th-TH", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <th>รวม</th>
              <th className="text-right">
                {calculateTotalCost().toLocaleString("th-TH", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </th>
            </tr>
          </tfoot>
        </table>
        <footer>
          <div>
            <p>ผู้เช่า</p>
            <p className="sign"></p>
          </div>
          <div>
            <p>ผู้ให้บริการ</p>
            <p className="sign"></p>
          </div>
        </footer>
      </div>
      {/* print button */}
      <div className="text-center mt-6">
        <button
          onClick={() => printDiv()}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          <i className="fas fa-print mr-2"></i>
          พิมพ์เอกสาร
        </button>
      </div>
      <style jsx>{`
        .receipt-container {
          font-family: "Sarabun", Arial, sans-serif;
          color: #222;
        }
        header {
          padding: 20px;
          padding-right: 0px;
          border-radius: 8px 8px 0 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }

        .info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 16px;
          font-size: 14px;
        }

        table.table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 14px;
        }

        table.table th,
        table.table td {
          border: 1px solid #333;
          padding: 10px;
        }

        table.table th {
          background-color: #e9ecef;
          padding: 10px;
        }

        table.table tr:nth-child(even) {
          background-color: #f8f9fa;
        }

        table.table tfoot th,
        table.table tfoot td {
          background-color: #dee2e6;
          font-weight: 700;
          font-size: 15px;
        }

        .text-right {
          text-align: right;
        }

        footer {
          display: flex;
          justify-content: space-between;
          margin-top: 50px;
          font-size: 14px;
        }

        .sign {
          width: 200px;
          text-align: center;
          border-top: 1px solid #000;
          padding-top: 6px;
          margin-top: 40px;
        }
      `}</style>
    </div>
  );
}
