import { options } from "@/app/api/auth/[...nextauth]/options";
import { getApplicants } from "@/app/helpers/getApplicants";
import { getListing } from "@/app/helpers/getListing";
import { getUserContent } from "@/app/helpers/getUser";
import { Avatar, Button, Chip, Link, User } from "@nextui-org/react";
import axios from "axios";
import parse from "html-react-parser";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
  params: {
    applicants: string;
  };
}

const page = async ({ params }: { params: { applicants: string } }) => {
  const session = await getServerSession(options);
  if (!session) return;

  const userInfo = await getUserContent(session.user.id);
  const listing = await getListing(params.applicants);
  const comp = await getUserContent(listing?.postedById as string);
  const applicantsObject = await getApplicants(params.applicants);
  const applicants = applicantsObject.applicants || [];
  const hired = applicantsObject.hired || [];
  const computerScreened = applicantsObject.computerScreened || [];
  const humanScreened = applicantsObject.humanScreened || [];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center pt-4">
        <div className="sm:flex-auto">
          <h1 className=" font-semibold leading-6 text-xl text-gray-900">
            Applicants for {listing?.title} at {comp?.firstName}
          </h1>
          <div className="mt-2 text-sm text-gray-700 flex gap-2">
            <p className="font-bold">Description: </p>
            <p>{listing?.description}</p>
          </div>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8 md:flex">
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
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {[
                  ...hired,
                  ...humanScreened,
                  ...computerScreened,
                  ...applicants,
                ].map((applicant) => (
                  <tr key={applicant.email}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {applicant.firstName + " " + applicant.lastName}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {applicant.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {applicant.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      <span>
                        {hired.includes(applicant) ? (
                          <Chip color="primary">Hired</Chip>
                        ) : humanScreened.includes(applicant) ? (
                          <Chip color="secondary">Human Screened</Chip>
                        ) : computerScreened.includes(applicant) ? (
                          <Chip color="secondary">Computer Screened</Chip>
                        ) : (
                          <Chip color="default">Applied</Chip>
                        )}
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a
                        href={`/employer-dashboard/applied/${params.applicants}/${applicant.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Applicant
                        <span className="sr-only">
                          , {applicant.firstName + " " + applicant.lastName}
                        </span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// const page = async ({ params }: { params: { listing: string } }) => {
//   const session = await getServerSession(options);
//   if (!session) return;

//   const userInfo = await getUserContent(session.user.id);
//   const listing = await getListing(params.listing);
//   const comp = await getUserContent(listing?.postedById as string);

//   return (
//     <div className="w-screen h-[calc(100vh-5rem)] p-4 bg-slate-100 flex text-black">
//       <div className="w-2/3 h-full bg-slate-200 flex flex-col p-4">
//         <h1 className="text-xl text-[#1E40AF] font-bold w-full flex justify-between">
//           Join {comp?.firstName} &lsquo;s Team as
//         </h1>
//         <h1 className="w-full overflow-ellipsis text-slate-800 text-7xl font-bold">
//           {listing?.title}
//         </h1>
//         <p className="overflow-y-scroll overflow-x-hidden p-2 scrollbar-thin scrollbar-webkit">
//           {parse(listing?.description as string)}
//         </p>
//       </div>
//       <div className="w-1/3 h-full  flex flex-col items-center pt-4">
//         <h1 className="w-full text-center text-2xl font-light mb-8">
//           Learn about the company
//         </h1>
//         <Avatar
//           src={`https://econnectbucket.s3.amazonaws.com/image/${listing?.postedById}`}
//           className="w-40 h-40 text-large"
//         />
//         <h1 className="font-bold text-lg">{comp.fullName}</h1>
//         <h1>{comp.location}</h1>
//         <p className="w-[30rem] h-[20rem] overflow-clip text-center mt-2">
//           {comp.bio}
//         </p>
//         <Link href={`/ec/${comp.id}`}>
//           <Button variant="flat">Comapny Page</Button>
//         </Link>
//       </div>
//     </div>
//   );
// };

export default page;
