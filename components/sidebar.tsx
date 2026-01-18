"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const sidebarMenu = [
    {
      label: "Apartment",
      href: "/home/apartment",
      icon: "fa fa-home",
    },
    {
      label: "Room Type",
      href: "/home/room-type",
      icon: "fa fa-bed",
    },
    {
      label: "Room",
      href: "/home/room",
      icon: "fa fa-box",
    },
    {
      label: "เงินเพิ่ม",
      href: "/home/money-add",
      icon: "fa fa-database",
    },
    {
      label: "ราคาค่าน้ำและค่าไฟ",
      href: "/home/water-and-electricity-price",
      icon: "fa fa-wand-magic-sparkles",
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
