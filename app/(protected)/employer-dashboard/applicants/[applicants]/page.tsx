import { options } from "@/app/api/auth/[...nextauth]/options";
import { getApplicants } from "@/app/helpers/getApplicants";
import { getListing } from "@/app/helpers/getListing";
import { getUserContent } from "@/app/helpers/getUser";
import { Avatar, Button, Chip, Link } from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";
import ScreenApplicants from "@/app/(protected)/components/functionComponents/ScreenApplicants";

interface PageProps {
  params: {
    applicants: string;
  };
}

const page = async ({ params }: PageProps) => {
  const session = await getServerSession(options);
  if (!session) return notFound();

  const userInfo = await getUserContent(session.user.id);
  const listing = await getListing(params.applicants);
  const comp = await getUserContent(listing?.postedById as string);
  const applicantsObject = await getApplicants(params.applicants);
  const applicants = applicantsObject.listingData?.[0]?.applicant ?? [];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center pt-4">
        <div className="sm:flex-auto">
          <h1 className="font-semibold leading-6 text-xl text-gray-900">
            Applicants for {listing?.title} at {comp?.firstName}
          </h1>
          <div className="mt-2 text-sm text-gray-700 flex gap-2">
            <p className="font-bold">Description: </p>
            <p className="w-[40rem]">{listing?.description}</p>

            <ScreenApplicants
              jobId={params.applicants}
              applicants={applicants}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Title
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Stage
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">View</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {applicants.map((applicant) => {
                  const user = applicant.user; // Access user data if available

                  return (
                    <tr key={user?.id || applicant.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                        {user ? `${user.firstName} ${user.lastName}` : "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user?.title || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {user?.email || "N/A"}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray 500">
                        {applicant.status === "pending" ? (
                          <Chip color="primary">{applicant.status}</Chip>
                        ) : (
                          <Chip color="success">{applicant.status}</Chip>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray 500">
                        {applicant.hired ? (
                          <Chip color="primary">Hired</Chip>
                        ) : applicant.humanScreened ? (
                          <Chip color="secondary">Human Screened</Chip>
                        ) : applicant.computerScreened ? (
                          <Chip color="success">Computer Screened</Chip>
                        ) : (
                          <Chip color="default">Not Screened</Chip>
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                        <Link
                          href={`/employer-dashboard/applied/${
                            params.applicants
                          }/${user?.id || applicant.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View Applicant
                          <span className="sr-only">
                            ,{" "}
                            {user
                              ? `${user.firstName} ${user.lastName}`
                              : "N/A"}
                          </span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
