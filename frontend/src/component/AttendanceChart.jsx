import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import API from "../api.js";

const AttendanceChart = () => {
  const [attendance, setAttendance] = useState([
    { name: "Present", value: 0 },
    { name: "Half Day", value: 0 },
    { name: "Absent", value: 0 },
  ]);

  // ✅ Fetch Attendance Data
  const fetchAttendance = async () => {
    try {
      const res = await API.get("/attendance");

      const records = res.data || [];

      // ✅ Count status
      const present = records.filter(
        (r) => r.status === "Present").length;

      const halfDay = records.filter(
        (r) => r.status === "Half Day").length;

      const absent = records.filter(
        (r) => r.status === "Absent").length;

      setAttendance([
        { name: "Present", value: present },
        { name: "Half Day", value: halfDay },
        { name: "Absent", value: absent },
      ]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

  const total = attendance.reduce((sum, item) => sum + item.value, 0);

  const present =
    attendance.find((d) => d.name === "Present")?.value || 0;

  const percent =
    total > 0 ? Math.round((present / total) * 100) : 0;

  return (
    <div
      className="bg-[#0f172a] border border-gray-800 rounded-2xl p-4 sm:p-5 md:p-6">
      {/* Header */}
      <div
        className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-5">
        <h2 className="text-white font-semibold text-base sm:text-lg">
          Attendance Overview
        </h2>

        <span className="text-blue-400 text-sm cursor-pointer hover:underline w-fit">
          Live Data →
        </span>
      </div>

      {/* Content */}
      <div
        className="
        flex flex-col md:flex-row 
        items-center md:items-center 
        gap-6 md:gap-8
      "
      >
        {/* Donut Chart */}
        <div className="relative w-40 h-40 sm:w-44 sm:h-44">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={attendance}
                innerRadius={55}
                outerRadius={75}
                paddingAngle={3}
                dataKey="value"
              >
                {attendance.map((entry, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center % */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-lg sm:text-xl font-semibold">
              {percent}%
            </span>
          </div>
        </div>

        {/* Legend */}
        <div
          className="
          grid grid-cols-3 md:grid-cols-1 
          gap-3 text-xs sm:text-sm text-gray-300
        "
        >
          {attendance.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 sm:gap-3"
            >
              <span
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: COLORS[i] }}
              ></span>

              <span className="truncate">
                {item.name} — {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;