import React from "react";
import { Input } from "@nextui-org/react";

interface JobTitleProps {
  title: string;
  setTitle: (title: string) => void;
}

const JobTitle: React.FC<JobTitleProps> = ({ title, setTitle }) => {
  return (
    <div className="col-span-full">
      <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">Title</label>
      <div className="mt-2">
        <Input
          isRequired
          defaultValue={title}
          className="my-2"
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <p className="mt-3 text-sm leading-6 text-gray-600">What is the title for this job listing?</p>
    </div>
  );
};

export default JobTitle; 