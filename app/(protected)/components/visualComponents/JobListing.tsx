"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { Badge, Card, Input, Skeleton, User } from "@nextui-org/react";
import Link from "next/link";
import { toast } from "sonner";
import axios from "axios";
import parse from "html-react-parser";
import { debounce } from "lodash"; // Import debounce function
import { Search } from "lucide-react";

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
                        (newJob: any) =>
                            !prevJobs.some((job) => job.id === newJob.id)
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
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Search Section */}
                <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input
                        type="text"
                        placeholder="Search job listings..."
                        className="w-full pl-10 h-12 bg-white shadow-sm transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-primary"
                        onChange={handleSearchChange}
                    />
                </div>

                {/* Job Listings */}
                <div className="space-y-4">
                    {jobs.map((job) => (
                        <Link
                            key={job.id}
                            href={`/job/${job.id}`}
                            className="block transition-transform duration-200 hover:scale-[1.02]"
                        >
                            <Card className="p-6 bg-white hover:shadow-lg transition-shadow duration-200">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-shrink-0">
                                        <User
                                            avatarProps={{
                                                src: `https://econnectbucket.s3.amazonaws.com/image/${job.postedById}`,
                                                className: "w-12 h-12",
                                            }}
                                            className="transition-transform"
                                            description={""}
                                            name={""}
                                        />
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-1">
                                                {job.title}
                                            </h3>
                                            <div className="text-gray-600 line-clamp-2">
                                                {parse(job.shortDescription)}
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-3">
                                            <span className="text-sm bg-blue-400 rounded-full p-2 text-white">
                                                {job.jobType}
                                            </span>
                                            <span className="flex items-center gap-1.5 text-gray-600">
                                                <FaLocationDot className="h-4 w-4" />
                                                {job.location}
                                            </span>
                                            <span className="text-gray-500">
                                                {new Date(
                                                    job.createdAt
                                                ).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {job.applicant.length > 100
                                                ? "Over 100 applicants"
                                                : job.applicant.length === 0
                                                ? "No applicants yet"
                                                : job.applicant.length === 1
                                                ? "1 applicant"
                                                : `${job.applicant.length} applicants`}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>

                {/* Loading States */}
                <div ref={sentinelRef} />
                {loading && (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <Card key={i} className="p-6">
                                <div className="flex gap-4">
                                    <Skeleton className="h-12 w-12 rounded-full" />
                                    <div className="space-y-3 flex-1">
                                        <Skeleton className="h-4 w-[250px]" />
                                        <Skeleton className="h-4 w-full" />
                                        <div className="flex gap-3">
                                            <Skeleton className="h-6 w-20" />
                                            <Skeleton className="h-6 w-32" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
                {!hasMore && (
                    <p className="text-center text-gray-500 py-4">
                        No more listings
                    </p>
                )}
            </div>
        </div>
    );
};

export default JobListing;
