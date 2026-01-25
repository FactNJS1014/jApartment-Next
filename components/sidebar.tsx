"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarMenu = [
    {
      label: "ข้อมูลหอพัก",
      href: "/home/apartment",
      icon: "fa fa-home",
    },
    {
      label: "ประเภทห้องพัก",
      href: "/home/room-type",
      icon: "fa fa-bed",
    },
    {
      label: "ห้องพัก",
      href: "/home/room",
      icon: "fa fa-box",
    },
    {
      label: "เงินเพิ่ม",
      href: "/home/money-add",
      icon: "fa fa-database",
    },
    {
      label: "บันทึกมิเตอร์น้ำ-ไฟ",
      href: "/home/water-and-electricity-log",
      icon: "fa fa-note-sticky",
    },
    {
      label: "ราคาค่าน้ำและค่าไฟ",
      href: "/home/water-and-electricity-price",
      icon: "fa fa-wand-magic-sparkles",
    },
    {
      label: "รายการบิล",
      href: "/home/bills",
      icon: "fa fa-file-invoice",
    },
    {
      label: "รายการย้ายห้อง",
      href: "/home/room-transfer",
      icon: "fa fa-arrow-right-arrow-left",
    },
    {
      label: "รายการย้ายออก",
      href: "/home/move-outs",
      icon: "fa fa-arrow-right-from-bracket",
    },
  ];

  return (
    <div className="w-[300px] h-screen bg-gray-700 text-white">
      <div className="p-4 text-center bg-gray-900">
        <div className="text-2xl font-bold">Apartment</div>
        <div className="text-xl mt-2">โปรแกรมบริหารงานหอพัก</div>
      </div>
      <nav className="p-5">
        <ul className="sidebar-menu">
          {sidebarMenu.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={
                  pathname === item.href
                    ? "text-blue-500"
                    : "text-white hover:text-blue-500"
                }
              >
                <span className="mr-2">
                  <i className={item.icon}></i>
                </span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
