"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

export default function Page() {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [lineId, setLineId] = useState("");
  const [taxCode, setTaxCode] = useState("");

  useEffect(() => {
    fetchApartment();
  }, []);
  const fetchApartment = async () => {
    try {
      const response = await axios.get("/api/apartment");
      const data = response.data;
      if (data.name) {
        setName(data.name);
        setAddress(data.address);
        setPhone(data.phone);
        setEmail(data.email);
        setLineId(data.lineId);
        setTaxCode(data.taxCode);
      }
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
        address: address,
        phone: phone,
        email: email,
        lineId: lineId,
        taxCode: taxCode,
      };
      const response = await axios.post("/api/apartment", payload);
      console.log(response.data);
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Apartment updated successfully",
      });
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
      <h1 className="text-2xl font-semibold">ข้อมูลหอพัก</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
        <div>
          <div>ชื่อหอพัก</div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <div>ที่อยู่</div>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <div>เบอร์โทรศัพท์</div>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <div>อีเมล</div>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <div>ไลน์</div>
          <input
            type="text"
            value={lineId}
            onChange={(e) => setLineId(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <div>เลขประจำตัวผู้เสียภาษี</div>
          <input
            type="text"
            value={taxCode}
            onChange={(e) => setTaxCode(e.target.value)}
            className="input"
          />
        </div>
        <div>
          <button type="submit" className="btn-primary">
            <i className="fa-solid fa-floppy-disk mr-2"></i>
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
}
