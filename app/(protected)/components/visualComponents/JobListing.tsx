"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { User } from "@nextui-org/react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import parse from "html-react-parser";
import { debounce } from "lodash"; // Import debounce function

const JobListing = () => {
  const [page, setPage] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef(null);

  // Debounced search term to avoid re-fetching with every keystroke
  const debouncedSearchTerm = useRef(
    debounce((term) => setSearchTerm(term), 500)
  ).current;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearchTerm(e.target.value);
  };

  const fetchJobs = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.post("/api/job/get/all", {
        page: page,
        limit: 5,
        searchTerm: searchTerm,
      });
      if (res.data.length > 0) {
        setJobs((prevJobs) => {
          const newJobs = res.data.filter(
            (newJob: any) => !prevJobs.some((job) => job.id === newJob.id)
          );
          return [...prevJobs, ...newJobs];
        });
        setPage((prevPage) => prevPage + 1);
      } else {
        setHasMore(false);
      }
    } catch {
      toast.error("Sorry, something went wrong.");
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, searchTerm]);

  // Reset jobs when search term changes without calling fetchJobs immediately
  useEffect(() => {
    setJobs([]);
    setPage(0);
    setHasMore(true);
  }, [searchTerm]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        fetchJobs();
      }
    });

    const currentRef = sentinelRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchJobs]);

  return (
    <div className="flex flex-col gap-4 mt-4 p-4 w-full items-center bg-zinc-100 overflow-scroll">
      {/* Search Field */}
      <input
        type="text"
        placeholder="Search job listings..."
        className="w-full max-w-md p-2 mb-4 border border-gray-300 rounded-md"
        onChange={handleSearchChange}
      />

      {/* Job Listings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl">
        {jobs.map((job) => (
          <Link
            key={job.id}
            href={`/job/${job.id}`}
            className="flex flex-col w-full p-4 bg-white shadow-md rounded-md hover:bg-zinc-200 transition transform duration-200"
          >
            <div className="flex items-center mb-4">
              <User
                avatarProps={{
                  src: `https://econnectbucket.s3.amazonaws.com/image/${job.postedById}`,
                }}
                className="transition-transform"
                description={""}
                name={""}
              />
            </div>
            <div>
              <span className="text-blue-800 text-sm">{job.title}</span>
              <h3 className="font-bold mt-px text-black line-clamp-3">
                {parse(job.shortDescription)}
              </h3>
              <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-600">
                <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-1">
                  {job.jobType}
                </span>
                <span className="flex items-center gap-1">
                  <FaLocationDot /> {job.location}
                </span>
                <span>{new Date(job.createdAt).toLocaleDateString()}</span>
              </div>
              <span className="text-slate-400 text-xs mt-2 block">
                {job.applicant.length > 100
                  ? "Over 100 applicants"
                  : job.applicant.length === 0
                  ? "No applicants"
                  : job.applicant.length === 1
                  ? "1 applicant"
                  : `${job.applicant.length} applicants`}
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div ref={sentinelRef} />
      {loading && (
        <p className="text-gray-500 mt-2">Loading more listings...</p>
      )}
      {!hasMore && <p className="text-gray-500 mt-2">No more listings</p>}
    </div>
  );
};

export default JobListing;
