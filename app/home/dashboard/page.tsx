"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardData {
  summary: {
    totalRooms: number;
    occupiedRooms: number;
    emptyRooms: number;
    totalGuests: number;
    totalRevenue: number;
  };
  occupancyData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  roomTypeData: Array<{
    name: string;
    value: number;
  }>;
  monthlyRevenueData: Array<{
    month: string;
    amount: number;
  }>;
  genderData: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/api/dashboard/states");
      setData(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen bg-learn-to-br from-purple-50 
            via-blue-50 to-indigo-100 flex items-center justify-center"
      >
        <div className="text-purple-600 text-xl">กำลังโหลด...</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        className="min-h-screen bg-linear-to-br from-purple-50 
            via-blue-50 to-indigo-100 flex items-center justify-center"
      >
        <div className="text-red-600 text-xl">ไม่สามารถโหลดข้อมูลได้</div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-linear-to-br from-purple-50 
        via-blue-50 to-indigo-100 p-6"
    >
      <div className="max-w-7xl mx-auto">
        <h1
          className="text-4xl font-bold text-transparent bg-clip-text 
                    bg-linear-to-r from-purple-600 to-blue-900 mb-8"
        >
          Dashboard
        </h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div
          className="bg-linear-to-br from-blue-500 to-blue-600 p-6 
                    rounded-2xl shadow-lg text-white transform 
                    hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">ห้องทั้งหมด</h3>
            <div
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center 
                            justify-center"
            >
              <i className="fa fa-home"></i>
            </div>
          </div>
          <p className="text-3xl font-bold">{data.summary.totalRooms}</p>
        </div>

        <div
          className="bg-linear-to-br from-emerald-500 to-emerald-600 
                    p-6 rounded-2xl shadow-lg text-white transform 
                    hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">ห้องว่าง</h3>
            <div
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center 
                            justify-center"
            >
              <i className="fa fa-file"></i>
            </div>
          </div>
          <p className="text-3xl font-bold">{data.summary.emptyRooms}</p>
        </div>

        <div
          className="bg-linear-to-br from-rose-500 to-rose-600 p-6 rounded-2xl 
                    shadow-lg text-white transform hover:scale-105 transition-transform"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">ห้องไม่ว่าง</h3>
            <div
              className="w-8 h-8 bg-white/20 rounded-lg flex 
                            items-center justify-center"
            >
              <i className="fa fa-cogs"></i>
            </div>
          </div>
          <p className="text-3xl font-bold">{data.summary.occupiedRooms}</p>
        </div>

        <div
          className="bg-linear-to-br from-purple-500 to-purple-600 p-6 
                    rounded-2xl shadow-lg text-white transform hover:scale-105 
                        transition-transform"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">ผู้เช่าทั้งหมด</h3>
            <div
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center 
                            justify-center"
            >
              <i className="fa fa-user"></i>
            </div>
          </div>
          <p className="text-3xl font-bold">{data.summary.totalGuests}</p>
        </div>

        <div
          className="bg-linear-to-br from-amber-500 to-amber-600 p-6 
                    rounded-2xl shadow-lg text-white transform hover:scale-105 
                    transition-transform"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium opacity-90">รายได้ทั้งหมด</h3>
            <div
              className="w-8 h-8 bg-white/20 rounded-lg flex items-center 
                        justify-center"
            >
              <i className="fa fa-dollar-sign"></i>
            </div>
          </div>
          <p className="text-3xl font-bold">
            ฿{data.summary.totalRevenue.toLocaleString("th-TH")}
          </p>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Room */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-gray-300">
          <h2
            className="text-xl font-bold text-gray-800 mb-4 flex 
                        items-center gap-2"
          >
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            สัดส่วนการเช่า
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.occupancyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) =>
                    `${name}: ${value} 
                                        (${(percent ? percent : 0 * 100).toFixed(0)}%)`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} ห้อง`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Gender Pie Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h2
            className="text-xl font-bold text-gray-800 mb-4 flex 
                        items-center gap-2"
          >
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            เพศผู้เช่า
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value, percent }) => `${name}: ${value} 
                                        คน (${(percent ? percent : 1 * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {data.genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} คน`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Room Types Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h2
            className="text-xl font-bold text-gray-800 mb-4 flex 
                    items-center gap-2"
          >
            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
            ประเภทห้อง
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.roomTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fill: "#666" }} />
                <YAxis tick={{ fill: "#666" }} />
                <Tooltip
                  formatter={(value) => [`${value} ห้อง`, "จำนวน"]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        {/* Monthly Revenue Bar Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            รายได้ 6 เดือนล่าสุด
          </h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.monthlyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fill: "#666" }} />
                <YAxis tick={{ fill: "#666" }} />
                <Tooltip
                  formatter={(value) => [
                    `฿${Number(value).toLocaleString("th-TH")}`,
                    "รายได้",
                  ]}
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="amount" fill="#f59e0b" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
