import { options } from "@/app/api/auth/[...nextauth]/options";
import { getListing } from "@/app/helpers/getListing";
import { getUserContent } from "@/app/helpers/getUser";
import { Avatar, Button, Link, User } from "@nextui-org/react";
import parse from "html-react-parser";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import React from "react";

interface PageProps {
    params: {
        listing: string;
    };
}

export async function generateMetadata({
    params,
}: {
    params: { listing: string };
}) {
    const { listing } = params;
    const session = await getServerSession(options);
    if (!session) notFound();

    const userInfo = await getUserContent(session.user.id);
    let flag = false;

    userInfo.jobListing?.forEach((job) => {
        job.id === listing ? (flag = true) : null;
    });

    if (flag == false) {
        notFound();
    }

    return { title: `Applications | ${userInfo.firstName} listing` };
}

interface PageProps {
    params: {
        listing: string;
    };
}

const page = async ({ params }: { params: { listing: string } }) => {
    const session = await getServerSession(options);
    if (!session) return;

    const userInfo = await getUserContent(session.user.id);
    const listing = await getListing(params.listing);
    const company = await getUserContent(listing?.postedById as string);

    return (
        <div className="w-screen h-[calc(100vh-5rem)] p-4 bg-slate-100 flex text-black">
            <div className="w-2/3 h-full bg-slate-200 flex flex-col p-4">
                <h1 className="text-xl text-[#1E40AF] font-bold w-full flex justify-between">
                    Join {company.fullName} &lsquo;s Team as
                </h1>
                <h1 className="w-full overflow-ellipsis text-slate-800 text-7xl font-bold">
                    {listing?.title}
                </h1>
                <p className="overflow-y-scroll overflow-x-hidden p-2 scrollbar-thin scrollbar-webkit">
                    {parse(listing?.description as string)}
                </p>
            </div>
            <div className="w-1/3 h-full  flex flex-col items-center pt-4">
                <h1 className="w-full text-center text-2xl font-light mb-8">
                    Learn about the company
                </h1>
                <Avatar
                    src={`https://econnectbucket.s3.amazonaws.com/image/${company.id}`}
                    className="w-40 h-40 text-large"
                />
                <h1 className="font-bold text-lg">{company.fullName}</h1>
                <h1>{company.location}</h1>
                <p className="w-[30rem] h-[20rem] overflow-clip text-center mt-2">
                    {company.bio}
                </p>
                <Link href={`/ec/${company.id}`}>
                    <Button variant="flat">Comapny Page</Button>
                </Link>
            </div>
        </div>
    );
};

export default page;
