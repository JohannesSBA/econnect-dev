"use client";

import { signOut } from "next-auth/react";
import { ButtonHTMLAttributes, FC, useState } from "react";
import { Button } from "@nextui-org/react";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);
  return (
    <Button
      onPress={async () => {
        setIsSigningOut(true);
        try {
          await signOut();
        } catch (error) {
          console.log("there was an error");
        } finally {
          setIsSigningOut(false);
        }
      }}
    >
      SignOut
    </Button>
  );
};

export default SignOutButton;
