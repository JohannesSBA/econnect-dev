"use client";
import { Jobs } from "@/app/types/db";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell
} from "recharts";

const Page = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({
    totalJobs: 0,
    activeJobs: 0,
    archivedJobs: 0,
    totalApplicants: 0,
    averageApplicantsPerJob: 0, 
    jobsByType: {},
    applicantsByLocation: {},
  });

  useEffect(() => {
    const getJobs = async () => {
      try {
        const res = await axios.post("/api/job/get/business");
        setJobs(res.data);

        console.log("this is res data", res.data);
        
        // Calculate analytics
        const active = res.data.filter((job: Jobs) => !job.Expired).length;
        const archived = res.data.filter((job: Jobs) => job.Expired).length;
        const totalApplicants = res.data.reduce((acc: number, job: Jobs) => {
          const totalJobApplicants = (job.hired?.length || 0) + 
                                   (job.HumanScreened?.length || 0) + 
                                   (job.ComputerScreened?.length || 0) + 
                                   (job.applicant?.length || 0);
          return acc + totalJobApplicants;
        }, 0);

        // Count jobs by type
        const jobTypes = res.data.reduce((acc: any, job: Jobs) => {
          acc[job.jobType] = (acc[job.jobType] || 0) + 1;
          return acc;
        }, {});

        // Count applicants by location
        const locationData = res.data.reduce((acc: any, job: Jobs) => {
          acc[job.location] = (acc[job.location] || 0) + (job.applicant?.length || 0);
          return acc;
        }, {});

        setAnalytics({
          totalJobs: res.data.length,
          activeJobs: active,
          archivedJobs: archived,
          totalApplicants: totalApplicants,
          averageApplicantsPerJob: totalApplicants / res.data.length || 0,
          jobsByType: jobTypes,
          applicantsByLocation: locationData,
        });

      } catch(error) {
        console.log(error);
        return toast.error("Sorry, something went wrong.");
      }
    };
    getJobs();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const jobTypeData = Object.entries(analytics.jobsByType).map(([name, value]) => ({
    name,
    value
  }));

  const locationData = Object.entries(analytics.applicantsByLocation).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-gray-50 px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Company Analytics Dashboard
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardBody>
              <div className="text-2xl font-bold">{analytics.totalJobs}</div>
              <div className="text-gray-600">Total Job Listings</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-2xl font-bold">{analytics.activeJobs}</div>
              <div className="text-gray-600">Active Listings</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-2xl font-bold">{analytics.totalApplicants}</div>
              <div className="text-gray-600">Total Applicants</div>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <div className="text-2xl font-bold">
                {analytics.averageApplicantsPerJob.toFixed(1)}
              </div>
              <div className="text-gray-600">Avg. Applicants per Job</div>
            </CardBody>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Jobs by Type</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <PieChart width={400} height={300}>
                <Pie
                  data={jobTypeData}
                  cx={200}
                  cy={150}
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jobTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-xl font-semibold">Applicants by Location</h2>
            </CardHeader>
            <Divider />
            <CardBody>
              <BarChart
                width={400}
                height={300}
                data={locationData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name="Applicants" />
              </BarChart>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
