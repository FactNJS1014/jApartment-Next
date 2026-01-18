"use client";

import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import RoomTypeInterface from "@/interface/RoomTypeInterface";
import { RoomInterface } from "@/interface/RoomInterface";
import Button from "@/components/button";
import Modal from "@/components/ui/modal";
import dayjs from "dayjs";

export default function Room() {
  const [rooms, setRooms] = useState<RoomInterface[]>([]);
  const [roomTypeId, setRoomTypeId] = useState("");
  const [roomType, setRoomType] = useState<RoomTypeInterface[]>([]);
  const [filterRoomTypeId, setFilterRoomTypeId] = useState("");
  const [id, setId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [totalRoom, setTotalRoom] = useState(0);
  const [tolowerName, setToLowerName] = useState("");
  const [totalLevel, setTotalLevel] = useState(0);

  //booking
  const [selectedRoomId, setSelectedRoomId] = useState("");
  const [isOpenBooking, setIsOpenBooking] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [cardId, setCardId] = useState("");
  const [gender, setGender] = useState("");
  const [roomId, setRoomId] = useState("");
  const [remark, setRemark] = useState("");
  const [deposit, setDeposit] = useState(0);
  const [stayAt, setStayAt] = useState(new Date());
  const [stayTo, setStayTo] = useState<Date | null>(null);

  //Log electricity and water
  const [waterInt, setWaterInt] = useState(0);
  const [electricityInt, setElectricityInt] = useState(0);

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  useEffect(() => {
    if (roomType.length > 0) {
      setRoomTypeId(roomType[0].id);
      setFilterRoomTypeId(roomType[0].id);
    }
  }, [roomType]);

  useEffect(() => {
    if (filterRoomTypeId) {
      fetchData();
    }
  }, [filterRoomTypeId]);

  const fetchData = async () => {
    try {
      const res = await axios.get("/api/room/list/" + filterRoomTypeId);
      setRooms(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: (error as Error).message,
      });
    }
  };

  const fetchRoomTypes = async () => {
    try {
      const res = await axios.get("/api/room-type");
      setRoomType(res.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: (error as Error).message,
      });
    }
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        tolowerName: tolowerName,
        totalRoom: totalRoom,
        totalLevel: totalLevel,
        roomTypeId: roomTypeId,
      };
      if (id) {
        await axios.put("/api/room/" + id, payload);
      } else {
        await axios.post("/api/room", payload);
      }

      fetchData();
      setIsOpen(false);
      clearForm();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: (error as Error).message,
      });
    }
  };

  const clearForm = () => {
    setId("");
    setToLowerName("");
    setTotalRoom(0);
    setTotalLevel(0);
    setRoomTypeId(roomType[0].id);
  };

  const handleBooking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        customerName: customerName,
        customerPhone: customerPhone,
        customerAddress: customerAddress,
        cardId: cardId,
        gender: gender,
        roomId: selectedRoomId,
        remark: remark,
        deposit: deposit,
        stayAt: stayAt,
        stayTo: stayTo,
        electricityInt: electricityInt,
        waterInt: waterInt,
      };
      await axios.post("/api/booking", payload);
      fetchData();
      setIsOpenBooking(false);
      clearFormBooking();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "error",
        text: (error as Error).message,
      });
    }
  };

  const clearFormBooking = () => {
    setCustomerName("");
    setCustomerPhone("");
    setCustomerAddress("");
    setCardId("");
    setGender("male");
    setRoomId("");
    setRemark("");
    setDeposit(0);
    setStayAt(new Date());
    setStayTo(new Date());
  };

  useEffect(() => {
    if (selectedRoomId) {
      const lastBooking = rooms.find((item) => item.id === selectedRoomId)
        ?.bookings?.[0];
      console.log(lastBooking);
      if (lastBooking) {
        setCustomerName(lastBooking.customerName);
        setCustomerPhone(lastBooking.customerPhone);
        setCustomerAddress(lastBooking.customerAddress);
        setCardId(lastBooking.cardId);
        setGender(lastBooking.gender);
        setRoomId(lastBooking.roomId);
        setRemark(lastBooking.remark);
        setDeposit(lastBooking.deposit);
        setStayAt(lastBooking.stayAt);

        if (lastBooking.stayTo) {
          setStayTo(new Date(lastBooking.stayTo));
        }
      } else {
        setCustomerName("");
        setCustomerPhone("");
        setCustomerAddress("");
        setCardId("");
        setGender("male");
        setRoomId("");
        setRemark("");
        setDeposit(0);
        setStayAt(new Date());
        setStayTo(new Date());
      }
    }
  }, [selectedRoomId]);

  const bookingInfo = (selectedRoomId: string) => {
    const lastBooking = rooms.find((item) => item.id === selectedRoomId)
      ?.bookings[0];
    console.log("lastBooking", lastBooking);
    const lastElectricityInt = lastBooking?.electricitylog[0];
    const lastWaterInt = lastBooking?.waterlog[0];

    console.log("lastElectricityInt", lastElectricityInt);
    console.log("lastWaterInt", lastWaterInt);

    if (lastBooking) {
      setCustomerName(lastBooking.customerName);
      setCustomerPhone(lastBooking.customerPhone);
      setCustomerAddress(lastBooking.customerAddress);
      setCardId(lastBooking.cardId);
      setGender(lastBooking.gender);
      setRoomId(lastBooking.roomId);
      setRemark(lastBooking.remark);
      setDeposit(lastBooking.deposit);
      setStayAt(lastBooking.stayAt);

      if (lastBooking.stayTo) {
        setStayTo(new Date(lastBooking.stayTo));
      }

      setElectricityInt(lastElectricityInt?.electricityInt || 0);
      setWaterInt(lastWaterInt?.waterInt || 0);
    } else {
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
      setCardId("");
      setGender("male");
      setRoomId("");
      setRemark("");
      setDeposit(0);
      setStayAt(new Date());
      setStayTo(new Date());
    }
  };

  return (
    <>
      <div className="text-2xl font-semibold">ห้องพัก</div>
      <Button
        onClick={() => {
          setIsOpen(true);
          clearForm();
        }}
      >
        <i className="fa-solid fa-plus mr-2"></i>เพิ่มห้องพัก
      </Button>
      <div className="flex gap-1 mt-3 shadow-2xl">
        <span className="w-40 justify-center bg-gray-400 p-3 rounded-l-md">
          ประเภทห้องพัก
        </span>
        <select
          className="input-modal"
          value={filterRoomTypeId}
          onChange={(e) => setFilterRoomTypeId(e.target.value)}
        >
          {roomType.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-5 gap-1 mt-3">
        {rooms.map((item) => (
          <div
            key={item.id}
            className={`p-2 rounded-md shadow-lg border border-gray-400 
          ${item.status == "active" ? "bg-green-100" : "bg-red-100"}
          ${item.statusEmpty == "no" ? "bg-red-100" : "bg-green-100"}`}
          >
            <div className="font-semibold text-xl">{item.name}</div>
            <div>{item.roomType.name}</div>
            <div>
              ค่าเช่า :{" "}
              <span className="font-semibold">
                {item.roomType.price.toLocaleString()}
              </span>
            </div>
            {item.statusEmpty == "no" ? (
              <div className="text-red-600 font-semibold">
                <i className="fa-solid fa-user"></i> มีคนเข้าพัก
              </div>
            ) : (
              <div className="text-green-600 font-semibold">
                <i className="fa-solid fa-user"></i> ห้องว่าง
              </div>
            )}
            <div className="flex gap-1 mt-2">
              {item.status == "active" ? (
                <>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    variant="default"
                    onClick={() => {
                      setSelectedRoomId(item.id);
                      setIsOpenBooking(true);
                      bookingInfo(item.id);
                    }}
                  >
                    <i className="fa-solid fa-user"></i>ผู้เข้าพัก
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      const button = await Swal.fire({
                        title: "Are you sure?",
                        text: "คุณต้องการลบห้องพักนี้หรือไม่?",
                        icon: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "ใช่, ลบเลย!",
                      });
                      if (button.isConfirmed) {
                        await axios.delete("/api/room/" + item.id);
                        fetchData();
                      }
                    }}
                  >
                    <i className="fa-solid fa-trash mr-2"></i>ลบ
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  onClick={async () => {
                    const button = await Swal.fire({
                      title: "Are you sure?",
                      text: "คุณต้องการเปิดห้องพักนี้หรือไม่?",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "ใช่, เปิดเลย!",
                    });
                    if (button.isConfirmed) {
                      await axios.put("/api/room/" + item.id);
                      fetchData();
                    }
                  }}
                >
                  <i className="fa-solid fa-unlock mr-2"></i>เปิดใช้งาน
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
      <Modal
        title="เพิ่มห้องพัก"
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <form onSubmit={handleSave}>
          <div>
            <label htmlFor="roomType">ประเภทห้องพัก</label>
            <select
              id="roomType"
              value={roomTypeId}
              onChange={(e) => setRoomTypeId(e.target.value)}
              className="input-modal"
            >
              {roomType.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-4 mt-3">
            <div>
              <label>ตึก</label>
              <input
                type="text"
                value={tolowerName}
                onChange={(e) => setToLowerName(e.target.value)}
                className="input-modal"
              />
            </div>
            <div>
              <label>จำนวนชั้น</label>
              <input
                type="number"
                value={totalLevel}
                onChange={(e) => setTotalLevel(Number(e.target.value))}
                className="input-modal"
              />
            </div>
          </div>
          <div>
            <label>จำนวนห้องพักแต่ละชั้น</label>
            <input
              type="number"
              value={totalRoom}
              onChange={(e) => setTotalRoom(Number(e.target.value))}
              className="input-modal"
            />
          </div>
          <Button type="submit" className="mt-3">
            <i className="fa-solid fa-save mr-2"></i>บันทึก
          </Button>
        </form>
      </Modal>
      <Modal
        title="เพิ่มผู้เข้าพัก"
        isOpen={isOpenBooking}
        onClose={() => setIsOpenBooking(false)}
      >
        <form onSubmit={handleBooking}>
          <div>
            <label htmlFor="name">ห้องพัก</label>
            <input
              type="text"
              id="name"
              disabled={true}
              value={rooms.find((item) => item.id === selectedRoomId)?.name}
              className="input-modal"
            />
          </div>
          <div className="flex gap-2">
            <div>
              <label>ชื่อผู้เข้าพัก</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="input-modal"
              />
            </div>
            <div>
              <label>เบอร์โทรศัพท์</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="input-modal"
              />
            </div>
          </div>
          <div>
            <label>ที่อยู่</label>
            <input
              type="text"
              value={customerAddress}
              onChange={(e) => setCustomerAddress(e.target.value)}
              className="input-modal"
            />
          </div>
          <div className="flex gap-2">
            <div className="w-full">
              <label>เลขบัตรประชาชน</label>
              <input
                type="text"
                value={cardId}
                onChange={(e) => setCardId(e.target.value)}
                className="input-modal"
              />
            </div>
            <div className="w-full">
              <label>เพศ</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="input-modal"
              >
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
              </select>
            </div>
            <div className="w-full">
              <label>เงินมัดจำ</label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(Number(e.target.value))}
                className="input-modal"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <div className="w-full">
              <label>วันที่เข้าพัก</label>
              <input
                type="date"
                value={dayjs(stayAt).format("YYYY-MM-DD")}
                onChange={(e) => setStayAt(new Date(e.target.value))}
                className="input-modal"
              />
            </div>
            <div className="w-full">
              <label>วันที่ออกพัก</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dayjs(stayTo).format("YYYY-MM-DD")}
                  onChange={(e) => setStayTo(new Date(e.target.value))}
                  className="input-modal"
                />
                <Button
                  type="button"
                  className="w-30"
                  variant="destructive"
                  onClick={() => setStayTo(null)}
                >
                  ไม่กำหนด
                </Button>
              </div>
            </div>
          </div>
          <div>
            <label>หมายเหตุ</label>
            <textarea
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              className="input-modal"
            />
          </div>
          <div className="flex gap-1">
            <div>
              <label>หน่วยไฟ</label>
              <input
                type="number"
                value={electricityInt}
                onChange={(e) => setElectricityInt(Number(e.target.value))}
                className="input-modal"
              />
            </div>
            <div>
              <label>หน่วยน้ำ</label>
              <input
                type="number"
                value={waterInt}
                onChange={(e) => setWaterInt(Number(e.target.value))}
                className="input-modal"
              />
            </div>
          </div>
          <Button type="submit" className="mt-3">
            <i className="fa-solid fa-save mr-2"></i>บันทึก
          </Button>
        </form>
      </Modal>
    </>
  );
}
