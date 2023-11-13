import { Session } from "next-auth";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: Date;
  updatedAt: Date;
  phoneNumber: string | null;
  password: string;
  role: $Enums.Role;
  bio: string | null;
}

interface BioProps {
  userBio: String;
}

interface CustomSession {
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
}
