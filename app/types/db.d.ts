import { stringList } from "aws-sdk/clients/datapipeline";
import { Session } from "next-auth";

interface User {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
  phoneNumber: string | null;
  password: string;
  role: $Enums.Role;
  bio: string | null;
  image: string;
  title: string;
  pronouns: string;
  location: String;
  friends: User[];
  pendingFriendRequests: User[];
  gotStarted: boolean;
  emailVerified: Date;
}

interface Jobs {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  jobType: string;
  location: string;
  createdAt: string;
  postedBy: User;
  postedById: string;
  Expired: boolean;
  expirationDate: string;
  applicant: User[];
  hired: User[];
  HumanScreened: User[];
  ComputerScreened: User[];
}

interface userProps {
  userBio: string;
  userName: string;
  userPronouns: stirng;
  userLocation: string;
  userCPosition: string;
  userTitle: string;
}

interface educationProps {
  school: string;
  degree: string;
  GPA: number;
  major: string;
}

interface CustomSession {
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
}

interface Friend {
  email: ReactNode;
  key: React.Key | null | undefined;
  id: string;
  firstName: string;
  lastName: string;
}
