"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { MoneyAddedInterface } from "@/interface/MoneyAddedInterface";
import Button from "@/components/button";
import Modal from "@/components/ui/modal";

export default function MoneyAdded() {
  const [moneyAdded, setMoneyAdded] = useState<MoneyAddedInterface[]>([]);
  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/money-added");
      setMoneyAdded(response.data);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const payload = {
        name: name,
        amount: amount,
      };
      if (id) {
        await axios.put(`/api/money-added/${id}`, payload);
      } else {
        await axios.post("/api/money-added", payload);
      }
      fetchData();
      setIsOpen(false);
      setName("");
      setAmount(0);
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
      });
    }
  };

  return (
    <div>
      <h1>ค่าใช้จ่ายเพิ่มเติม</h1>
      <Button onClick={() => setIsOpen(true)}>
        <i className="fa fa-plus"></i>
        เพิ่มค่าใช้จ่าย
      </Button>

      <table className="table mt-2">
        <thead>
          <tr>
            <th className="text-left">ชื่อค่าใช้จ่าย</th>
            <th className="text-right">จำนวนเงิน</th>
            <th className="w-[160px]"></th>
          </tr>
        </thead>
        <tbody>
          {moneyAdded.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td className="text-right">{item.amount}</td>
              <td>
                <div className="flex gap-2">
                  <Button
                    onClick={() => {
                      setId(item.id);
                      setName(item.name);
                      setAmount(item.amount);
                      setIsOpen(true);
                    }}
                  >
                    <i className="fa fa-pencil"></i>
                    แก้ไข
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      try {
                        const confirmButton = await Swal.fire({
                          icon: "question",
                          title: "คุณต้องการลบค่าใช้จ่ายนี้หรือไม่?",
                          showCancelButton: true,
                          showConfirmButton: true,
                        });

                        if (confirmButton.isConfirmed) {
                          await axios.delete("/api/money-added/" + item.id);
                          fetchData();
                        }
                      } catch (err) {
                        Swal.fire({
                          icon: "error",
                          title: "Error",
                          text: (err as Error).message,
                        });
                      }
                    }}
                  >
                    <i className="fa fa-times"></i>
                    ลบ
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
        title="เพิ่มค่าใช้จ่าย"
      >
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label>ชื่อค่าใช้จ่าย</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-modal"
            />
          </div>
          <div className="mb-4">
            <label>จำนวนเงิน</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input-modal"
            />
          </div>
          <div className="flex justify-end">
            <Button>
              <i className="fa fa-check"></i>
              บันทึก
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
