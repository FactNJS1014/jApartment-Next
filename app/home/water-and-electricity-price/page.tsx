"use client";

import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Button from "@/components/button";

export default function WaterAndElectricityPrice() {
  const [waterPricePerUnit, setWaterPricePerUnit] = useState(0);
  const [electricityPricePerUnit, setElectricityPricePerUnit] = useState(0);
  const [id, setId] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/water-and-electricity-price");
      setWaterPricePerUnit(response.data.waterPricePerUnit);
      setElectricityPricePerUnit(response.data.electricityPricePerUnit);
      setId(response.data.id);
    } catch (error) {
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
        waterPricePerUnit: waterPricePerUnit,
        electricityPricePerUnit: electricityPricePerUnit,
      };
      if (id) {
        await axios.put("/api/water-and-electricity-price/" + id, payload);
      } else {
        await axios.post("/api/water-and-electricity-price", payload);
      }

      fetchData();

      Swal.fire({
        icon: "success",
        title: "Success",
        text: "บันทึกสำเร็จ",
        timer: 1000,
      });
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
      <h1 className="text-2xl font-bold">ราคาค่าน้ำและค่าไฟ</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <label>ราคาค่าน้ำต่อหน่วย</label>
          <input
            type="number"
            value={waterPricePerUnit}
            className="input-modal"
            onChange={(e) => setWaterPricePerUnit(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label>ราคาค่าไฟต่อหน่วย</label>
          <input
            type="number"
            value={electricityPricePerUnit}
            className="input-modal"
            onChange={(e) => setElectricityPricePerUnit(Number(e.target.value))}
          />
        </div>
        <div>
          <Button>
            <i className="fa fa-check"></i>
            บันทึก
          </Button>
        </div>
      </form>
    </div>
  );
}
