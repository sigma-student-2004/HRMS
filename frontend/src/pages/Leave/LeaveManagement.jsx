import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../api.js";

const statusStyle = {
  Pending: "bg-yellow-500/10 text-yellow-400 border border-yellow-500/20",
  Approved: "bg-green-500/10 text-green-400 border border-green-500/20",
  Rejected: "bg-red-500/10 text-red-400 border border-red-500/20",
};

const LeaveManagement = () => {
  const [leaves, setLeaves] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    type: "Annual",
    from: "",
    to: "",
  });

  // ✅ Fetch Leaves
  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const res = await API.get("/leaves");

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

  // ✅ Submit Leave
  const handleSubmit = async () => {
    if (!form.name || !form.from || !form.to) {
      return alert("Please fill all fields");
    }

    try {
      await API.post("/leaves", form);

      fetchLeaves();

      setShowForm(false);

      setForm({
        name: "",
        type: "Annual",
        from: "",
        to: "",
      });
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Update Status
  const updateStatus = async (id, status) => {
    try {
      await API.put(`/leaves/${id}`, {
        status,
      });

      fetchLeaves();
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ Filter
  const filteredLeaves =
    filter === "All"
      ? leaves
      : leaves.filter((l) => l.status === filter);

  return (
    <div className="min-h-screen bg-[#0b1220] text-white p-4 md:p-8 md:ml-64 space-y-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">

        <div>
          <h1 className="text-2xl font-bold">Leave Management</h1>

          <p className="text-gray-400 text-sm">
            {
              leaves.filter((l) => l.status === "Pending").length
            }{" "}
            pending requests
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2 rounded-lg text-sm hover:opacity-90"
        >
          {showForm ? "Close" : "+ Apply Leave"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-[#111827] border border-gray-700 rounded-xl p-6 space-y-6">

          <h2 className="text-lg font-semibold">
            Apply for Leave
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <input
              type="text"
              placeholder="Employee Name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="bg-[#020617] border border-gray-700 p-3 rounded-lg outline-none"
            />

            <select
              value={form.type}
              onChange={(e) =>
                setForm({
                  ...form,
                  type: e.target.value,
                })
              }
              className="bg-[#020617] border border-gray-700 p-3 rounded-lg"
            >
              <option>Annual</option>
              <option>Sick</option>
              <option>Comp Off</option>
            </select>

            <input
              type="date"
              value={form.from}
              onChange={(e) =>
                setForm({
                  ...form,
                  from: e.target.value,
                })
              }
              className="bg-[#020617] border border-gray-700 p-3 rounded-lg [color-scheme:dark]"
            />

            <input
              type="date"
              value={form.to}
              onChange={(e) =>
                setForm({
                  ...form,
                  to: e.target.value,
                })
              }
              className="bg-[#020617] border border-gray-700 p-3 rounded-lg [color-scheme:dark]"
            />
          </div>

          <div className="flex gap-3">

            <button
              onClick={handleSubmit}
              className="bg-indigo-600 px-5 py-2 rounded-lg text-sm hover:bg-indigo-700"
            >
              Submit
            </button>

            <button
              onClick={() => setShowForm(false)}
              className="border border-gray-600 px-5 py-2 rounded-lg text-sm hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* FILTER */}
      <div className="flex gap-2 flex-wrap">
        {["All", "Pending", "Approved", "Rejected"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-1 rounded-full text-sm ${
              filter === tab
                ? "bg-indigo-600"
                : "bg-gray-700 text-gray-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TABLE */}
      <div className="bg-[#111827] border border-gray-700 rounded-xl overflow-x-auto">

        <table className="w-full min-w-[800px] text-sm">

          <thead className="bg-[#020617] text-gray-400">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Days</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center p-6"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredLeaves.length > 0 ? (
              filteredLeaves.map((l) => (
                <tr
                  key={l._id}
                  className="border-t border-gray-800"
                >
                  <td className="p-3">{l.name}</td>

                  <td className="p-3">{l.type}</td>

                  <td className="p-3">
                    {new Date(l.from).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    {new Date(l.to).toLocaleDateString()}
                  </td>

                  <td className="p-3">{l.days}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded ${statusStyle[l.status]}`}
                    >
                      {l.status}
                    </span>
                  </td>

                  <td className="p-3">

                    {l.status === "Pending" && (
                      <div className="flex gap-2">

                        <button
                          onClick={() =>
                            updateStatus(
                              l._id,
                              "Approved"
                            )
                          }
                          className="bg-green-600 px-2 py-1 text-xs rounded"
                        >
                          Approve
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(
                              l._id,
                              "Rejected"
                            )
                          }
                          className="bg-red-600 px-2 py-1 text-xs rounded"
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
                  colSpan="7"
                  className="text-center p-6 text-gray-400"
                >
                  No leave requests found
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaveManagement;