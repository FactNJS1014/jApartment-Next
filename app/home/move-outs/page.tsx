"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import Modal from "@/components/ui/modal";
import { RoomInterface } from "@/interface/RoomInterface";
import { MoveOutInterface } from "@/interface/MoveOutInterface";
import RoomTypeInterface from "@/interface/RoomTypeInterface";
import Button from "@/components/button";

export default function MoveOutPage() {
  const [moveOuts, setMoveOuts] = useState<MoveOutInterface[]>([]);
  const [rooms, setRooms] = useState<RoomInterface[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomTypeInterface[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  //Form state
  const [roomsId, setRoomsId] = useState<string>("");
  const [bookingId, setBookingId] = useState<string>("");
  const [moveOutDate, setMoveOutDate] = useState<string>(
    new Date().toISOString(),
  );
  const [reason, setReason] = useState<string>("");
  const [depositReturn, setDepositReturn] = useState<number>(0);
  const [outstandingFees, setOutstandingFees] = useState<number>(0);

  const clearForm = () => {
    setRoomsId("");
    setBookingId("");
    setMoveOutDate(new Date().toISOString());
    setReason("");
    setDepositReturn(0);
    setOutstandingFees(0);
  };

  useEffect(() => {
    fetchMoveOut();
    fetchRoom();
  }, []);

  const fetchRoom = async () => {
    try {
      const types = await axios.get("/api/room-type");
      const roomPromises = types.data.map((type: RoomTypeInterface) =>
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

  const occupiedRooms = rooms.filter((room) => room.statusEmpty === "no");

  const fetchMoveOut = async () => {
    try {
      const res = await axios.get("/api/move-outs");
      setMoveOuts(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: (error as Error).message,
      });
    }
  };

  const handleRoomChange = (roomId: string) => {
    setRoomsId(roomId);
    const room = rooms.find((room) => room.id === roomId);
    if (room && room.bookings.length > 0) {
      setBookingId(room.bookings[0].id);
    } else {
      setBookingId("");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        roomsId: roomsId,
        moveOutDate: dayjs(moveOutDate).toISOString(),
        depositReturn: depositReturn,
        outstandingFees: outstandingFees,
        reason: reason,
        bookingId: bookingId,
      };

      const res = await axios.post("/api/move-outs", payload);
      setIsOpen(false);

      Swal.fire({
        icon: "success",
        title: "สำเร็จ",
        text: "เพิ่มรายการย้ายออกสำเร็จ",
        timer: 2000,
        showConfirmButton: false,
      });
      clearForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: (error as Error).message,
      });
    }
  };

  const handComplete = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "ยืนยันการย้ายออก",
        text: "คุณต้องการย้ายออกหรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        try {
          await axios.put(`/api/move-outs/${id}`, {
            status: "completed",
          });
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "ย้ายออกสำเร็จ",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchMoveOut();
          fetchRoom();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: (error as Error).message,
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: (error as Error).message,
      });
    }
  };

  const handCancel = async (id: string) => {
    try {
      const result = await Swal.fire({
        title: "ยืนยันการย้ายออก",
        text: "คุณต้องการย้ายออกหรือไม่?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
      });

      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/move-outs/${id}`);
          Swal.fire({
            icon: "success",
            title: "สำเร็จ",
            text: "ย้ายออกสำเร็จ",
            timer: 2000,
            showConfirmButton: false,
          });
          fetchMoveOut();
          fetchRoom();
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: (error as Error).message,
          });
        }
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: (error as Error).message,
      });
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col justify-between items-left mb-8 gap-4">
        <div className="">
          <h1 className="text-3xl font-bold text-gray-700">แจ้งย้ายออก</h1>
          <p className="text-gray-600">จัดการข้อมูลการย้ายออกของผู้เข้าพัก</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => {}}
            className="flex items-center gap-2 shadow-md"
          >
            <i className="fa-solid fa-arrows-rotate"></i>
            Refresh
          </Button>
          <Button
            onClick={() => {
              clearForm();
              setIsOpen(true);
            }}
            className="flex items-center gap-2 shadow-md"
          >
            <i className="fa-solid fa-plus"></i>
            เพิ่มรายการย้ายออก
          </Button>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="overflow-y-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 text-gray-700 font-semibold *:text-center">
                  ห้องหัก
                </th>
                <th className="p-4 text-gray-700 font-semibold text-center">
                  ผู้เข้าพัก
                </th>
                <th className="p-4 text-gray-700 font-semibold text-center">
                  วันที่ย้ายออก
                </th>
                <th className="p-4 text-gray-700 font-semibold text-center">
                  คืนเงินมัดจำ
                </th>
                <th className="p-4 text-gray-700 font-semibold text-center">
                  ค่าใช้จ่ายค้างชำระ
                </th>
                <th className="p-4 text-gray-700 font-semibold text-center">
                  สถานะ
                </th>
                <th className="p-4 text-gray-700 font-semibold text-center">
                  จัดการ
                </th>
              </tr>
            </thead>
            <tbody>
              {moveOuts.map((moveOut) => (
                <tr key={moveOut.id}>
                  <td className="p-4">
                    <div>{moveOut.room?.name}</div>
                    <div>{moveOut.room?.roomType?.name}</div>
                  </td>
                  <td className="p-4">
                    <div>{moveOut.booking?.customerName}</div>
                    <div>{moveOut.booking?.customerPhone}</div>
                  </td>
                  <td className="p-4 text-center">
                    {dayjs(moveOut.moveOutDate).format("DD/MM/YYYY")}
                  </td>
                  <td className="p-4 text-right">
                    {moveOut.depositReturn?.toLocaleString()}
                  </td>
                  <td className="p-4 text-right">
                    {moveOut.outstandingFees?.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    {moveOut.status === "pending"
                      ? "รอการอนุมัติ"
                      : "อนุมัติสำเร็จ"}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex gap-2">
                      {moveOut.status === "pending" && (
                        <Button
                          variant="outline"
                          className="flex items-center gap-2 bg-green-500 text-white"
                          onClick={() => handComplete(moveOut.id)}
                        >
                          <i className="fa-solid fa-circle-check"></i>
                          อนุมัติ
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        className="flex items-center gap-2 bg-red-500 text-white"
                        onClick={() => handCancel(moveOut.id)}
                      >
                        <i className="fa-solid fa-circle-xmark"></i>
                        ยกเลิก
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="แจ้งย้ายออก"
      >
        <form className="space-y-6 py-2" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label
              htmlFor="roomsId"
              className="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <i className="fa-solid fa-bed text-blue-500"></i>
              เลือกห้องหัก
            </label>
            <select
              className="input-modal"
              onChange={(e) => handleRoomChange(e.target.value)}
            >
              <option value="">--เลือกห้องหัก--</option>
              {occupiedRooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.name} {room.bookings[0]?.customerName}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="moveOutDate"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <i className="fa-solid fa-calendar text-purple-500"></i>
                วันที่ย้ายออก
              </label>
              <input
                type="date"
                id="moveOutDate"
                name="moveOutDate"
                value={dayjs(moveOutDate).format("YYYY-MM-DD")}
                onChange={(e) => setMoveOutDate(e.target.value)}
                className="input-modal"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="reason"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <i className="fa-solid fa-piggy-bank text-green-500"></i>
                คืนเงินมัดจำ
              </label>
              <input
                type="number"
                id="depositReturn"
                name="depositReturn"
                value={depositReturn}
                onChange={(e) => setDepositReturn(Number(e.target.value))}
                className="input-modal text-right"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="moveOutDate"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                <i className="fa-solid fa-file-invoice-dollar text-red-500"></i>
                ค่าปรับ
              </label>
              <input
                type="number"
                id="outstandingFees"
                name="outstandingFees"
                value={outstandingFees}
                onChange={(e) => setOutstandingFees(Number(e.target.value))}
                className="input-modal text-right"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="reason"
                className="flex items-center gap-2 text-sm font-medium text-gray-700"
              >
                เหตุผลประกอบการย้ายออก
              </label>
              <textarea
                id="reason"
                name="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="input-modal h-20"
                placeholder="ระบุเหตุผลประกอบการย้ายออก"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-gray-300">
            <Button
              onClick={() => setIsOpen(false)}
              className="bg-gray-500 text-white"
            >
              ยกเลิก
            </Button>
            <Button className="bg-blue-500 text-white">
              <i className="fa-solid fa-check"></i>
              ยืนยัน
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
