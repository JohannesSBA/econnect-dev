import { Session } from "next-auth";

interface User {
  name: string;
  email: string;
  password: string;
  id: number;
  bio: string;
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
