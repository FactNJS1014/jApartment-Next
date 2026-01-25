"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Button from "@/components/button";
import Modal from "@/components/ui/modal";
import { TowerInterface } from "@/interface/TowerInterface";
import { RoomInterface } from "@/interface/RoomInterface";

export default function WaterAndElectricityLog() {
  const [towers, setTowers] = useState<TowerInterface[]>([]);
  const [rooms, setRooms] = useState<RoomInterface[]>([]);

  useEffect(() => {
    fetchDataTower();
  }, []);

  useEffect(() => {
    if (towers.length > 0) {
      fetchDataRoom(towers[0].tolowerName);
    }
  }, [towers]);

  const fetchDataTower = async () => {
    try {
      const response = await axios.get("/api/room/list/tower-name");
      const data = response.data;
      setTowers(data);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
      });
    }
  };

  const fetchDataRoom = async (towername: string) => {
    try {
      const response = await axios.get(
        `/api/room/filter-by-tower/${towername}`
      );
      const data = response.data;
      setRooms(data);
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
      });
    }
  };

  const handleSave = async (
    roomName: string,
    waterMeter: number,
    electricityMeter: number
  ) => {
    try {
      if (waterMeter === 0 || electricityMeter === 0) {
        return;
      }
      const payload = {
        roomName: roomName,
        waterMeter: waterMeter,
        electricityMeter: electricityMeter,
      };
      const response = await axios.post(
        "/api/water-and-electricity-log",
        payload
      );
      const data = response.data;
    } catch (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: (error as Error).message,
      });
    }
  };

  const handleUpdate = async (
    roomName: string,
    waterMeter?: number,
    electricityMeter?: number
  ) => {
    setRooms((prev) => {
      const index = prev.findIndex((room) => room.name === roomName);
      if (index === -1) return prev;

      const roomsCopy = [...prev];
      const room = roomsCopy[index];
      const booking = room.bookings[0];

      if (!booking) {
        return prev;
      }

      roomsCopy[index] = {
        ...room,
        bookings: [
          {
            ...booking,
            waterlog: [
              {
                ...booking.waterlog[0],
                waterInt: waterMeter ?? booking.waterlog[0].waterInt,
              },
            ],
            electricitylog: [
              {
                ...booking.electricitylog[0],
                electricityInt:
                  electricityMeter ?? booking.electricitylog[0].electricityInt,
              },
            ],
          },
        ],
      };
      return roomsCopy;
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">บันทึกมิเตอร์น้ำ-ไฟ</h1>
      <div>
        {towers.map((tower) => (
          <Button
            key={tower.tolowerName}
            size="lg"
            value={tower.tolowerName}
            onClick={() => fetchDataRoom(tower.tolowerName)}
          >
            อาคาร {tower.tolowerName}
          </Button>
        ))}
      </div>
      {rooms.length > 0 ? (
        <table className="table mt-2">
          <thead>
            <tr>
              <th>เลขห้อง</th>
              <th>มิเตอร์น้ำ</th>
              <th>มิเตอร์ไฟฟ้า</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.name}</td>
                <td>
                  {room.bookings[0]?.waterlog[0]?.waterInt ? (
                    <input
                      type="number"
                      className="input text-right"
                      value={room.bookings[0]?.waterlog[0]?.waterInt ?? ""}
                      onChange={(e) =>
                        handleUpdate(room.name, Number(e.target.value))
                      }
                      onBlur={(e) =>
                        handleSave(
                          room.name,
                          Number(e.target.value),
                          room.bookings[0]?.electricitylog[0]?.electricityInt ??
                            0
                        )
                      }
                    />
                  ) : (
                    <span>ไม่พบข้อมูลผู้เข้าพัก</span>
                  )}
                </td>
                <td>
                  {room.bookings[0]?.electricitylog[0]?.electricityInt ? (
                    <input
                      type="number"
                      className="input text-right"
                      value={
                        room.bookings[0]?.electricitylog[0]?.electricityInt ??
                        ""
                      }
                      onChange={(e) =>
                        handleUpdate(
                          room.name,
                          undefined,
                          Number(e.target.value)
                        )
                      }
                      onBlur={(e) =>
                        handleSave(
                          room.name,
                          room.bookings[0]?.waterlog[0]?.waterInt ?? 0,
                          Number(e.target.value)
                        )
                      }
                    />
                  ) : (
                    <span>ไม่พบข้อมูลผู้เข้าพัก</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>ไม่พบข้อมูลห้องพัก</p>
      )}
    </div>
  );
}
