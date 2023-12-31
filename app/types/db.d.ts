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
}

interface userProps {
  userBio: string;
  userName: string;
  userPronouns: stirng;
  userLocation: string;
  userEducation: stirng;
  userCPosition: string;
  userTitle: string;
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
  key: React.Key | null | undefined;
  id: string;
  firstName: string;
  lastName: string;
}
