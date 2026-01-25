"use client";

import Button from "@/components/button";
import { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import Modal from "@/components/ui/modal";
import { RoomInterface } from "@/interface/RoomInterface";
import { RoomTransferInterface } from "@/interface/RoomTransferInterface";
import RoomTypeInterface from "@/interface/RoomTypeInterface";

export default function RoomTransferPage() {
  const [isOpen, setIsOpen] = useState(false);

  const [transfer, setTransfer] = useState<RoomTransferInterface[]>([]);
  const [rooms, setRooms] = useState<RoomInterface[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeInterface[]>([]);

  // form state
  const [fromRoomId, setFromRoomId] = useState<string>("");
  const [toRoomId, setToRoomId] = useState<string>("");
  const [bookingId, setBookingId] = useState<string>("");
  const [transferDate, setTransferDate] = useState<string>("");
  const [transferFee, setTransferFee] = useState<number>(0);
  const [reason, setReason] = useState<string>("");

  const clearForm = () => {
    setFromRoomId("");
    setToRoomId("");
    setBookingId("");
    setTransferDate(new Date().toISOString().split("T")[0]);
    setTransferFee(0);
    setReason("");
  };
  return (
    <div className="p-6">
      <div className="flex flex-col justify-between items-left mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">รายการย้ายห้อง</h1>
          <p className="text-gray-600">จัดการข้อมูลการย้ายห้องของผู้เข้าพัก</p>
        </div>
        <div className="flex gap-2">
          <Button
            className="flex items-center gap-2 shadow-lg"
            variant="secondary"
          >
            <i className="fa fa-refresh"></i> รีเฟรช
          </Button>
          <Button
            className="flex items-center gap-2 shadow-lg bg-blue-500 hover:bg-blue-600"
            onClick={() => {
              setIsOpen(true);
              clearForm();
            }}
          >
            <i className="fa fa-plus"></i> เพิ่มรายการ
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-bold text-gray-700">ห้องเดิม</th>
                <th className="p-4 font-bold text-gray-700 text-center">
                  <i className="fa-solid fa-right-left"></i>
                </th>
                <th className="p-4 font-bold text-gray-700">ห้องใหม่</th>
                <th className="p-4 font-bold text-gray-700">วันที่ย้าย</th>
                <th className="p-4 font-bold text-gray-700">ค่าย้าย</th>
                <th className="p-4 font-bold text-gray-700">เหตุผล</th>
                <th className="p-4 font-bold text-gray-700">สถานะ</th>
                <th className="p-4 font-bold text-gray-700 text-center">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4">
                  <div className="font-medium text-gray-900">1101</div>
                  <div className="text-gray-500 text-md">ห้องแอร์</div>
                </td>
                <td className="p-4 text-center">
                  <i className="fa-solid fa-arrow-right"></i>
                </td>
                <td className="p-4">
                  <div className="font-medium text-gray-900">1102</div>
                  <div className="text-gray-500 text-md">ห้องแอร์</div>
                </td>
                <td className="p-4">25 ม.ค. 2569</td>
                <td className="p-4">500</td>
                <td className="p-4">-</td>
                <td className="p-4">รอดำเนินการ</td>
                <td className="p-4 text-center">
                  <div className="flex gap-2 justify-center">
                    <Button className="flex items-center gap-2 shadow-lg bg-green-500 hover:bg-green-600">
                      <i className="fa-solid fa-circle-check"></i>
                      ยืนยัน
                    </Button>
                    <Button className="flex items-center gap-2 shadow-lg bg-red-500 hover:bg-red-600">
                      <i className="fa-solid fa-circle-xmark"></i>
                      ยกเลิก
                    </Button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add Room Transfer */}
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="สร้างรายการย้ายห้อง"
      >
        <form></form>
      </Modal>
    </div>
  );
}
