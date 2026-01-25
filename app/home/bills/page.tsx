"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "@/components/button";
import Modal from "@/components/ui/modal";

interface Bill {
  id: string;
  roomId: string;
  bookingId: string;
  billDate: string;
  waterUnit: number;
  electricityUnit: number;
  roomPrice: number;
  additionalCost: number;
  waterCost: number;
  electricityCost: number;
  totalAmount: number;
  status: string;

  room: {
    id: string;
    name: string;
  };
  booking: {
    id: string;
    customerName: string;
  };
  billItems: {
    id: string;
    name: string;
    amount: number;
    type: string;
  }[];
}

export default function Bills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [selectedBillId, setSelectedBillId] = useState<Bill | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [paymentDate, setPaymentDate] = useState("");
  const [lateFee, setLateFee] = useState(0);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await axios.get("/api/bills");
      setBills(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRecieveBill = async (bill: Bill) => {
    setSelectedBillId(bill);
    setIsOpen(true);
    setPaymentDate(new Date().toISOString().split("T")[0]);
    setLateFee(0);
  };

  const handleSaveBills = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const saveBill = {
        id: selectedBillId?.id,
        paymentDate: paymentDate,
        lateFee: lateFee,
        status: "paid",
      };
      const response = await axios.put(
        `/api/bills/${selectedBillId?.id}`,
        saveBill,
      );
      fetchBills();
      setIsOpen(false);
      setSelectedBillId(null);
      Swal.fire({
        icon: "success",
        title: "Bill saved successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Bill saved failed",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const getStatusColors = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-600";
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "overdue":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "paid":
        return "ชำระแล้ว";
      case "pending":
        return "รอชำระ";
      case "overdue":
        return "เกินกำหนด";
      default:
        return status;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold">
        <i className="fa fa-file-invoice w-7"></i>
        รายการบิล
      </h1>

      <table className="table mt-3">
        <thead>
          <tr>
            <th className="px-4 py-2">ห้อง</th>
            <th className="px-4 py-2">ลูกค้า</th>
            <th className="px-4 py-2">วันที่ออกบิล</th>
            <th className="px-4 py-2 text-right">ยอดเงิน</th>
            <th className="px-4 py-2 text-center">สถานะ</th>
            <th className="px-4 py-2 text-center w-[130px]">การดำเนินการ</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill, index) => (
            <tr key={bill.id}>
              <td className="px-4 py-2">{bill.room.name}</td>
              <td className="px-4 py-2">{bill.booking.customerName}</td>
              <td className="px-4 py-2">{formatDate(bill.billDate)}</td>
              <td className="px-4 py-2 text-right">
                {bill.totalAmount.toLocaleString()}
              </td>
              <td className="px-4 py-2 text-center">
                <span
                  className={`${getStatusColors(bill.status)} px-2 py-1 rounded text-sm`}
                >
                  {getStatusText(bill.status)}
                </span>
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleRecieveBill(bill)}
                  className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
                >
                  <i className="fa fa-money-bill mr-2"></i>
                  รับบิล
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="รับชําระเงิน"
      >
        <form onSubmit={handleSaveBills}>
          <div>
            <label className="form-label">ข้อมูลบิล</label>
            <div className="mb-3 flex flex-col gap-2 text-sm bg-gray-100 p-2 border rounded">
              <p>
                <strong>ห้องพัก: </strong>
                {selectedBillId?.room.name}
              </p>
              <p>
                <strong>ลูกค้า: </strong>
                {selectedBillId?.booking.customerName}
              </p>
              <p>
                <strong>ยอดเงิน: </strong>
                {selectedBillId?.totalAmount.toLocaleString()} บาท
              </p>
            </div>
          </div>
          <div className="mb-3">
            <label className="form-label">วันที่ชำระเงิน</label>
            <input
              type="date"
              className="input-modal w-full"
              value={paymentDate}
              onChange={(e) => setPaymentDate(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">ค่าปรับ</label>
            <input
              type="number"
              className="input-modal w-full"
              value={lateFee}
              onChange={(e) => setLateFee(Number(e.target.value))}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" className="btn btn-primary">
              ชำระ
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
