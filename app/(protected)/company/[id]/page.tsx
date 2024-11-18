import AddFriendButton from "@/app/(protected)/components/functionComponents/AddFriendButton";
import EditContent from "@/app/(protected)/components/functionComponents/EditContent";
import ProfileImage from "@/app/(protected)/components/functionComponents/ProfileImage";
import UserAbout from "@/app/(protected)/components/visualComponents/UserAbout";
import UserEducation from "@/app/(protected)/components/visualComponents/UserEducation";
import { options } from "@/app/api/auth/[...nextauth]/options";
import { getUserContent } from "@/app/helpers/getUser";
import { chatHrefConstructor } from "@/app/lib/utils";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Link,
} from "@nextui-org/react";
import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";
import { FiUserPlus, FiMessageSquare, FiExternalLink } from "react-icons/fi";
import UploadResume from "../../components/functionComponents/UploadResume";
import { getEducation } from "@/app/helpers/getEducation";
import { getExperience } from "@/app/helpers/getExperience";
import Posts from "../../components/visualComponents/Posts";
import {
  MdLocationOn,
  MdEmail,
  MdPhone,
  MdPinDrop,
  MdFileDownload,
} from "react-icons/md";
import NewEducation from "../../components/functionComponents/NewEducation";
import NewExperience from "../../components/functionComponents/NewExperience";
import UserProfile from "../../dashboard/profile/ClientComponent";
import { string } from "zod";
import { FaMessage } from "react-icons/fa6";
import { IoLink } from "react-icons/io5";
import { getListing } from "@/app/helpers/getListing";

const page = async ({ params }: { params: { id: string } }) => {
  const session = await getServerSession(options);
  if (!session) {
    notFound();
  }
  if (session.user.id === params.id) {
    redirect("/dashboard/profile");
  }

  const userInfo = await getUserContent(params.id);
  const accUser = await getUserContent(session.user.id);
  const stringifiedFriends = JSON.stringify(userInfo.friends);
  const pageName = "profile";

  const role = accUser.role as string;
  let userActionButton;
  if (role === "EMPLOYER") {
    const chatRoom = chatHrefConstructor(userInfo.id, session.user.id);
    userActionButton = (
      <div>
        <a href={`/chat/${chatRoom}`}>
          <Button color="primary">Send a Message</Button>
        </a>
      </div>
    );
  }

  const dateJoined = userInfo.emailVerified;

  let TotalApplicants = 0;
  if (userInfo.jobListingsPosted && userInfo.jobListingsPosted.length > 0) {
    for (const job of userInfo.jobListingsPosted) {
      const listing = await getListing(job.id);
      if (listing) {
        TotalApplicants += listing.applicant.length;
      }
    }
  }

  function formatDate(dateString: string | number | Date) {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  return (
    <div className="container mx-auto p-4 max-w-7xl overflow-scroll">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-6">
          {/* Header */}
          <Card>
            <CardBody className="p-6">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
                <Avatar
                  src={
                    "https://econnectbucket.s3.amazonaws.com/image/" +
                    userInfo.id
                  }
                  className="w-32 h-32"
                  alt={userInfo.firstName}
                />
                <div className="text-center md:text-left flex-grow">
                  <h1 className="text-3xl font-bold">
                    {userInfo.firstName + " " + userInfo.lastName}
                  </h1>
                  <p className="text-xl text-default-500">{userInfo.title}</p>
                  <p className="flex items-center justify-center md:justify-start mt-2 text-sm text-default-500">
                    <MdLocationOn className="mr-2 h-4 w-4" />
                    {userInfo.location &&
                    userInfo.location.includes("undefined")
                      ? "No Location Available"
                      : userInfo.location}
                  </p>

                  <div className="mt-2 flex gap-4 items-center">
                    {userActionButton}
                    {userInfo.bio && userInfo.bio.split("!WB!")[1] !== "" ? (
                      <Button as={Link} href={userInfo.bio.split("!WB!")[1]}>
                        <FiExternalLink className="mr-2 h-4 w-4" /> Visit
                        Website
                      </Button>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          {/* About */}
          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-lg font-bold">About</p>
              </div>
            </CardHeader>
            <CardBody>
              <p>{userInfo.bio && userInfo.bio.split("!WB!")[0]}</p>
            </CardBody>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader className="flex justify-between items-center">
              <p className="text-lg font-bold">Experience</p>
              <NewExperience />
            </CardHeader>
            <CardBody className="space-y-6"></CardBody>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader className="flex justify-between flex-col flex-start">
              <p className="text-lg font-bold">Recent Posts</p>
              <Posts userId={userInfo.id} fromPage={"my"} />
            </CardHeader>
            <CardBody></CardBody>
          </Card>

          {/* Skills */}
          <Card>
            {/* <CardHeader className="flex justify-between items-center">
              <p className="text-lg font-bold">Skills</p>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                onClick={addSkill}
                aria-label="Add skill"
              >
                <MdAdd className="h-5 w-5" />
              </Button>
            </CardHeader>
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Chip key={index} variant="flat" color="primary">
                    {skill}
                  </Chip>
                ))}
              </div>
            </CardBody> */}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <p className="text-lg font-bold">Contact Information</p>
              </div>
            </CardHeader>
            <CardBody className="space-y-2">
              <p className="flex items-center">
                <MdEmail className="mr-2 h-5 w-5" />
                {userInfo.email}
              </p>
              <p className="flex items-center">
                <MdPhone className="mr-2 h-5 w-5" />
                {userInfo.phoneNumber}
              </p>
              <p className="flex items-center">
                <MdPinDrop className="mr-2 h-5 w-5" />
                {userInfo.location && userInfo.location.includes("undefined")
                  ? "No Location Available"
                  : userInfo.location}
              </p>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
