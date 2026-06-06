import React, { useEffect, useState } from "react";
import axios from "axios";
import { Briefcase, MapPin, Clock } from "lucide-react";
import API from "../api.js";

const JobSummary = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch jobs from backend
  const fetchJobs = async () => {
    try {
      const res = await API.get("/jobs");
      setJobs(res.data);
    } catch (err) {
      console.log("Error fetching jobs", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  return (
    <div
      className="
      bg-[#0f172a] border border-gray-800 rounded-2xl 
      p-4 sm:p-5 md:p-6 
      h-full
    "
    >
      {/* Header */}
      <div
        className="
        flex flex-col sm:flex-row sm:justify-between sm:items-center
        gap-2 mb-5
      "
      >
        <h2 className="text-white font-semibold text-base sm:text-lg">
          Job Openings
        </h2>

        <span className="text-blue-400 text-sm cursor-pointer hover:underline w-fit">
          View all →
        </span>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-gray-400 text-sm">Loading jobs...</div>
      ) : (
        <div
          className="
          space-y-3 sm:space-y-4 
          max-h-[250px] sm:max-h-[300px] md:max-h-[340px] 
          overflow-y-auto pr-1
        "
        >
          {jobs.length > 0 ? (
            jobs.map((job) => (
              <div
                key={job._id}
                className="
                  p-3 sm:p-4 
                  rounded-xl border border-gray-800 
                  bg-[#111827] 
                  hover:bg-[#1f2937] transition
                "
              >
                {/* Top */}
                <div
                  className="
                    flex flex-col sm:flex-row sm:justify-between sm:items-center
                    gap-2
                  "
                >
                  <h3 className="text-white font-medium text-sm sm:text-base">
                    {job.title}
                  </h3>

                  <span
                    className="
                      w-fit text-xs px-2 py-1 rounded-full 
                      bg-blue-500/20 text-blue-400
                    "
                  >
                    {job.type}
                  </span>
                </div>

                {/* Info */}
                <div
                  className="
                    grid grid-cols-1 sm:grid-cols-3 
                    gap-2 sm:gap-4 
                    mt-2 text-xs sm:text-sm text-gray-400
                  "
                >
                  <span className="flex items-center gap-1">
                    <MapPin size={14} /> {job.location}
                  </span>

                  <span className="flex items-center gap-1">
                    <Briefcase size={14} /> {job.department}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock size={14} />{" "}
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Bottom */}
                <div
                  className="
                    mt-3 flex flex-col sm:flex-row 
                    sm:justify-between sm:items-center 
                    gap-2
                  "
                >
                  <span className="text-xs text-gray-500">
                    {job.applicants?.length || 0} applicants
                  </span>

                  <button
                    className="
                      text-sm text-blue-400 hover:underline 
                      w-fit
                    "
                  >
                    View →
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500">
              <Briefcase size={28} />
              <p className="mt-2 text-sm">No jobs posted</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobSummary;