"use client";
import React from "react";
import { Button } from "@nextui-org/react";
import axios from "axios";

type screenApplicantsProps = {
  jobId: string;
  applicants: any[];
};

export default function ScreenApplicants({
  jobId,
  applicants,
}: screenApplicantsProps) {
  function screenNewApps() {
    axios.post("/api/job/screen", {
      jobId: jobId,
      applicants: applicants,
    });
  }

  return (
    <Button
      color="primary"
      className="p-2"
      onClick={() => {
        screenNewApps();
      }}
    >
      Screen Applicants
    </Button>
  );
}
