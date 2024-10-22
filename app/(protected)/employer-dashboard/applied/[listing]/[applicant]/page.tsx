import { getListing } from "@/app/helpers/getListing";
import { getUserContent } from "@/app/helpers/getUser";
import { Button } from "@nextui-org/react";
import axios from "axios";
import { AiOutlinePaperClip } from "react-icons/ai";
import ClientComponent from "./ClientComponent";

interface PageProps {
  params: {
    listing: string;
    applicant: string;
  };
}

export default async function Page({
  params,
}: {
  params: { applicant: string; listing: string };
}) {
  const user = await getUserContent(params.applicant);
  const listing = await getListing(params.listing);

  return (
    <div className="overflow-scroll h-screen w-screen bg-white shadow sm:rounded-lg m-2 p-2">
      <ClientComponent
        user={{
          id: user.id as string,
          firstName: user.firstName as string,
          lastName: user.lastName as string,
          email: user.email as string,
          bio: user.bio as string,
        }}
        listing={{
          title: listing?.title as string,
        }}
        listingId={listing?.id ?? ""}
        applicantId={listing?.applicants[0]?.id ?? ""}
      />
    </div>
  );
}
