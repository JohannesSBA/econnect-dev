// import { options } from "@/app/api/auth/[...nextauth]/options";
// import { getListing } from "@/app/helpers/getListing";
// import { getUserContent } from "@/app/helpers/getUser";
// import { Avatar, Button, Link, User } from "@nextui-org/react";
// import { getServerSession } from "next-auth";
// import { notFound } from "next/navigation";
// import React from "react";

// interface PageProps {
//   params: {
//     listing: string;
//   };
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: { listing: string };
// }) {
//   const { listing } = params;
//   const session = await getServerSession(options);
//   if (!session) notFound();

//   const userInfo = await getUserContent(session.user.id);
//   let flag = false;

//   userInfo.jobListing?.forEach((job) => {
//     job.id === listing ? (flag = true) : null;
//   });

//   if (!flag) {
//     notFound();
//   }

//   return { title: `Applications | ${userInfo.firstName} listing` };
// }

// const page = async ({ params }: PageProps) => {
//   const session = await getServerSession(options);
//   if (!session) return;

//   const listing = await getListing(params.listing);

//   // Assuming `listing.applicants` contains an array of applicant objects with status
//   const applicants = listing?.applicants || [];

//   // Organize applicants into categories
//   const denied = applicants.filter(
//     (applicant) => applicant.status === "denied"
//   );
//   const accepted = applicants.filter(
//     (applicant) => applicant.status === "accepted"
//   );
//   const notReviewed = applicants.filter(
//     (applicant) => applicant.status === "not reviewed"
//   );

//   return (
//     <div className="w-screen h-[calc(100vh-5rem)] p-4 bg-slate-100 flex flex-col text-black">
//       <h1 className="text-2xl font-bold mb-4">
//         Applicants for {listing?.title}
//       </h1>

//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Accepted Applicants</h2>
//         {accepted.length > 0 ? (
//           accepted.map((applicant) => (
//             <div key={applicant.id} className="p-2 bg-green-100 rounded mb-2">
//               <Avatar src={applicant.avatarUrl} size="sm" />
//               <span>{applicant.name}</span>
//             </div>
//           ))
//         ) : (
//           <p>No accepted applicants yet.</p>
//         )}
//       </div>

//       <div className="mb-6">
//         <h2 className="text-xl font-semibold mb-2">Denied Applicants</h2>
//         {denied.length > 0 ? (
//           denied.map((applicant) => (
//             <div key={applicant.id} className="p-2 bg-red-100 rounded mb-2">
//               <Avatar src={applicant.avatarUrl} size="sm" />
//               <span>{applicant.name}</span>
//             </div>
//           ))
//         ) : (
//           <p>No denied applicants yet.</p>
//         )}
//       </div>

//       <div>
//         <h2 className="text-xl font-semibold mb-2">Not Reviewed Applicants</h2>
//         {notReviewed.length > 0 ? (
//           notReviewed.map((applicant) => (
//             <div key={applicant.id} className="p-2 bg-yellow-100 rounded mb-2">
//               <Avatar src={applicant.avatarUrl} size="sm" />
//               <span>{applicant.name}</span>
//             </div>
//           ))
//         ) : (
//           <p>No applicants are pending review.</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default page;
