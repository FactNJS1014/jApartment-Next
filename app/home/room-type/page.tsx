"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Button from "@/components/button";
import Modal from "@/components/ui/modal";
import RoomTypeInterface from "@/interface/RoomTypeInterface";

export default function RoomType() {
  const [roomTypes, setRoomTypes] = useState<RoomTypeInterface[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [remark, setRemark] = useState("");

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const fetchRoomTypes = async () => {
    try {
      const response = await axios.get("/api/room-type");
      const data = response.data;
      setRoomTypes(data);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload = {
        name: name,
        price: price,
        remark: remark,
      };
      if (id) {
        await axios.put(`/api/room-type/${id}`, payload);
      } else {
        await axios.post("/api/room-type", payload);
      }
      setIsOpen(false);
      fetchRoomTypes();
      clearForm();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
      });
    }
  };

  const clearForm = () => {
    setId("");
    setName("");
    setPrice(0);
    setRemark("");
  };

  const handleDelete = async (id: string) => {
    try {
      const buttonConfirm = await Swal.fire({
        icon: "question",
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });
      if (!buttonConfirm.isConfirmed) {
        return;
      }
      await axios.delete(`/api/room-type/${id}`);
      fetchRoomTypes();
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
      });
    }
  };
  return (
    <div>
      <h1>ประเภทห้องพัก</h1>
      <Button
        onClick={() => {
          clearForm();
          setIsOpen(true);
        }}
      >
        <i className="fa-solid fa-plus mr-2"></i> เพิ่มประเภทห้องพัก
      </Button>
      <table className="table mt-2">
        <thead className="bg-gray-400">
          <tr>
            <th className="p-3">ชื่อประเภทห้องพัก</th>
            <th className="p-3">ราคา</th>
            <th className="p-3">หมายเหตุ</th>
            <th className="w-24">จัดการ</th>
          </tr>
        </thead>
        <tbody className="bg-gray-50 border-b border-gray-400">
          {roomTypes.map((roomType) => (
            <tr key={roomType.id}>
              <td className="p-3">{roomType.name}</td>
              <td className="p-3">{roomType.price}</td>
              <td className="p-3">{roomType.remark}</td>
              <td>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      clearForm();
                      setIsOpen(true);
                      setId(roomType.id);
                      setName(roomType.name);
                      setPrice(roomType.price);
                      setRemark(roomType.remark);
                    }}
                  >
                    <i className="fa-solid fa-pen mr-2"></i> แก้ไข
                  </Button>
                  <Button
                    onClick={() => handleDelete(roomType.id)}
                    variant="destructive"
                  >
                    <i className="fa-solid fa-trash mr-2"></i> ลบ
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="เพิ่มประเภทห้องพัก"
      >
        <div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                placeholder="ชื่อประเภทห้องพัก"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-modal"
              />
            </div>
            <div className="mb-3">
              <input
                type="number"
                placeholder="ราคา"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="input-modal"
              />
            </div>
            <div className="mb-3">
              <input
                type="text"
                placeholder="หมายเหตุ"
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                className="input-modal"
              />
            </div>
            <Button type="submit">
              <i className="fa-solid fa-save mr-2"></i> บันทึก
            </Button>
          </form>
        </div>
      </Modal>
    </div>
  );
}
