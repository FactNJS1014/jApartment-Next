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

  useEffect(() => {
    fetchTransfer();
    fetchRoom();
  }, []);

  const fetchRoom = async () => {
    try {
      const res = await axios.get("/api/room-type");
      const types: RoomTypeInterface[] = res.data;

      const roomPromises = types.map((type) =>
        axios.get("/api/room/list/" + type.id),
      );
      const roomResponse = await Promise.all(roomPromises);
      const allRooms = roomResponse.flatMap((res) => res.data);

      setRooms(allRooms);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: (error as Error).message,
      });
    }
  };

  const fetchTransfer = async () => {
    try {
      const res = await axios.get("/api/room-transfer");
      setTransfer(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: (error as Error).message,
      });
    }
  };

  const clearForm = () => {
    setFromRoomId("");
    setToRoomId("");
    setBookingId("");
    setTransferDate(new Date().toISOString());
    setTransferFee(0);
    setReason("");
  };

  const occupiedRooms = rooms.filter((room) => room.statusEmpty === "no");
  const emptyRooms = rooms.filter((room) => room.statusEmpty !== "no");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!fromRoomId || !toRoomId) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "กรุณาเลือกห้องเดิมและห้องใหม่",
        });
      }

      const payload = {
        fromRoomId: fromRoomId,
        toRoomId: toRoomId,
        bookingId: bookingId,
        transferDate: dayjs(transferDate).toISOString(),
        transferFee: transferFee,
        reason: reason,
      };

      await axios.post("/api/room-transfer", payload);
      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "เพิ่มรายการย้ายห้องสำเร็จ",
        timer: 2000,
        timerProgressBar: true,
      });

      setIsOpen(false);
      fetchTransfer();
      fetchRoom();
      clearForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: (error as Error).message,
      });
    }
  };

  const handleFromRoomChange = (roomId: string) => {
    setFromRoomId(roomId);
    const selectedRoom = rooms.find((room) => room.id === roomId);
    if (selectedRoom) {
      setBookingId(selectedRoom.bookings[0]?.id || "");
    }
  };

  const handleConfirm = async (transferId: string) => {
    const result = await Swal.fire({
      icon: "question",
      title: "ยืนยันการย้ายห้อง",
      text: "คุณต้องการย้ายห้องนี้หรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
    });
    if (result.isConfirmed) {
      try {
        await axios.put(`/api/room-transfer/${transferId}`, {
          status: "completed",
        });
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          text: "ย้ายห้องสำเร็จ",
          timer: 2000,
          timerProgressBar: true,
        });
        fetchTransfer();
        fetchRoom();
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: (error as Error).message,
        });
      }
    }
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
              {transfer.length == 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="py-12 text-center text-gray-500 italic"
                  >
                    ไม่พบข้อมูล
                  </td>
                </tr>
              ) : (
                transfer.map((transfer, index) => (
                  <tr key={index}>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {transfer.fromRoom?.name}
                      </div>
                      <div className="text-gray-500 text-md">
                        {transfer.fromRoom?.roomType?.name}
                      </div>
                    </td>
                    <td className="p-4 text-center">
                      <i className="fa-solid fa-arrow-right"></i>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        {transfer.toRoom?.name}
                      </div>
                      <div className="text-gray-500 text-md">
                        {transfer.toRoom?.roomType?.name}
                      </div>
                    </td>
                    <td className="p-4">
                      {dayjs(transfer.transferDate).format("DD MMM YYYY")}
                    </td>
                    <td className="p-4">{transfer.transferFee}</td>
                    <td className="p-4">{transfer.reason || "-"}</td>
                    <td className="p-4">
                      {transfer.status === "pending" ? "รอการยืนยัน" : "สำเร็จ"}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex gap-2 justify-center">
                        {transfer.status === "pending" && (
                          <Button
                            className="bg-green-500 hover:bg-green-600"
                            onClick={() => handleConfirm(transfer.id)}
                          >
                            <i className="fa-solid fa-circle-check"></i> ยืนยัน
                          </Button>
                        )}
                        <Button className="bg-red-500 hover:bg-red-600">
                          <i className="fa-solid fa-circle-xmark"></i> ยกเลิก
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
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
        <form className="space-y-6 py-2" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="" className="flex items-center gap-2">
                <i className="fa-solid fa-magnifying-glass text-blue-500"></i>
                ห้องต้นทาง (ห้องที่ไม่ว่าง)
              </label>
              <select
                className="input-modal"
                value={fromRoomId}
                onChange={(e) => handleFromRoomChange(e.target.value)}
              >
                <option value="">-- เลือกห้อง --</option>
                {occupiedRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} - {room.bookings[0]?.customerName}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="" className="flex items-center gap-2">
                <i className="fa-solid fa-magnifying-glass text-blue-500"></i>
                ห้องปลายทาง (ห้องที่ว่าง)
              </label>
              <select
                className="input-modal"
                value={toRoomId}
                onChange={(e) => setToRoomId(e.target.value)}
              >
                <option value="">-- เลือกห้อง --</option>
                {emptyRooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name} - {room.roomType.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="" className="flex items-center gap-2">
                <i className="fa-solid fa-calendar text-blue-500"></i>
                วันที่ย้าย
              </label>
              <input
                type="date"
                className="input-modal"
                value={dayjs(transferDate).format("YYYY-MM-DD")}
                onChange={(e) =>
                  setTransferDate(dayjs(e.target.value).toDate().toISOString())
                }
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="" className="flex items-center gap-2">
                <i className="fa-solid fa-money-bill text-blue-500"></i>
                ค่าย้าย
              </label>
              <input
                type="number"
                className="input-modal"
                value={transferFee}
                onChange={(e) => setTransferFee(Number(e.target.value))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="" className="flex items-center gap-2">
              <i className="fa-solid fa-comment text-blue-500"></i>
              เหตุผล
            </label>
            <textarea
              className="input-modal min-h-20"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
          <div className="flex gap-2 justify-end border-t pt-4 border-gray-400">
            <Button
              className="bg-red-500 hover:bg-red-600 shadow-lg text-white"
              variant="secondary"
            >
              <i className="fa-solid fa-xmark"></i> ยกเลิก
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg text-white">
              <i className="fa-solid fa-circle-check"></i> ยืนยันการย้ายห้อง
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
