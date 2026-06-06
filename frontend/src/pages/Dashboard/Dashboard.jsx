import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../component/Navbar";
import Sidebar from "../../component/Sidebar";
import StatsCards from "../../component/StatsCards";
import QuickLinks from "../../component/QuickLinks";
import AttendanceChart from "../../component/AttendanceChart";
import RecentActivities from "../../component/RecentActivities";
import LeaveWidget from "../../component/LeaveWidget";
import JobSummary from "../../component/JobSummary";
import Footer from "../../component/Footer";
import API from "../../api.js";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [activities, setActivities] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetchData();
    fetchJobs();
  }, []);

  const fetchData = async () => {
    try {
      const res = await API.get("/dashboard");
      setStats(res.data.stats);
      setActivities(res.data.activities);
      setAttendance(res.data.attendance);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.log("Using default jobs");
    }
  };

  return (
    <div className="text-white space-y-6 p-4 sm:p-6 md:p-4  md:ml-64">

      {/* Stats */}
      <StatsCards stats={stats}/>

      {/* Quick Links */}
      <QuickLinks />

      {/* Charts + Activities */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AttendanceChart />
        <RecentActivities />
      </div>

      {/* Leave */}
      <LeaveWidget />

      {/* Jobs */}
      <JobSummary />

    </div>
  );
};

export default Dashboard;