import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../api.js";

const LeaveWidget = () => {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);

  // ✅ Fetch leaves from backend
  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const res = await API.get("/leaves"
      );

      setLeaves(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  // ✅ Update status
  const handleStatus = async (id, status) => {
    try {
      await API.put(
        `/leaves/${id}`,
        { status }
      );

      fetchLeaves();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Status Color
  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-500/20 text-green-400";

      case "Rejected":
        return "bg-red-500/20 text-red-400";

      default:
        return "bg-yellow-500/20 text-yellow-400";
    }
  };

  return (
    <div className="bg-[#0f172a] border border-gray-800 rounded-2xl p-4 sm:p-5 md:p-6 w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-5">

        <h2 className="text-white text-base sm:text-lg font-semibold">
          Leave Requests
        </h2>

        <span className="text-blue-400 text-sm">
          Total: {leaves.length}
        </span>
      </div>

      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block overflow-x-auto">

        <table className="w-full text-sm text-gray-300">

          <thead>
            <tr className="border-b border-gray-800 text-gray-400">
              <th className="p-3 text-left">Employee</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">From</th>
              <th className="p-3 text-left">To</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6"
                >
                  Loading...
                </td>
              </tr>
            ) : leaves.length > 0 ? (
              leaves.map((leave) => (
                <tr
                  key={leave._id}
                  className="border-b border-gray-800 hover:bg-[#111827] transition"
                >
                  <td className="p-3 text-white">
                    {leave.name}
                  </td>

                  <td className="p-3">
                    {leave.type}
                  </td>

                  <td className="p-3">
                    {new Date(
                      leave.from
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    {new Date(
                      leave.to
                    ).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${getStatusColor(
                        leave.status
                      )}`}
                    >
                      {leave.status}
                    </span>
                  </td>

                  <td className="p-3 text-center">

                    {leave.status ===
                      "Pending" && (
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() =>
                            handleStatus(
                              leave._id,
                              "Approved"
                            )
                          }
                          className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 text-xs"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            handleStatus(
                              leave._id,
                              "Rejected"
                            )
                          }
                          className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-xs"
                        >
                          Reject
                        </button>
                      </div>
                    )}

                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center p-6 text-gray-400"
                >
                  No leave requests found
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* ================= MOBILE CARDS ================= */}
      <div className="md:hidden space-y-4">

        {loading ? (
          <div className="text-center text-gray-400">
            Loading...
          </div>
        ) : leaves.length > 0 ? (
          leaves.map((leave) => (
            <div
              key={leave._id}
              className="bg-[#111827] border border-gray-800 rounded-xl p-4"
            >
              <div className="flex justify-between items-center mb-2">

                <h3 className="text-white font-medium">
                  {leave.name}
                </h3>

                <span
                  className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                    leave.status
                  )}`}
                >
                  {leave.status}
                </span>
              </div>

              <p className="text-sm text-gray-400">
                {leave.type}
              </p>

              <p className="text-sm text-gray-400 mt-1">
                {new Date(
                  leave.from
                ).toLocaleDateString()}{" "}
                →
                {" "}
                {new Date(
                  leave.to
                ).toLocaleDateString()}
              </p>

              {leave.status === "Pending" && (
                <div className="flex gap-2 mt-4">

                  <button
                    onClick={() =>
                      handleStatus(
                        leave._id,
                        "Approved"
                      )
                    }
                    className="flex-1 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() =>
                      handleStatus(
                        leave._id,
                        "Rejected"
                      )
                    }
                    className="flex-1 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm"
                  >
                    Reject
                  </button>

                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-400">
            No leave requests found
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaveWidget;