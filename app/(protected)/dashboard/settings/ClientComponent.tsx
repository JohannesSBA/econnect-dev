"use client"; // This is required for client-side routing

import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import EditContent from "../../components/EditContent";
import AccountPreferences from "./SideBarComponents/AccountPreferences";
import SignInSecurity from "./SideBarComponents/SignInSecurity";

const sections = [
  { label: "Account preferences", id: "account-preferences" },
  { label: "Sign in & security", id: "sign-in-security" },
  // { label: "Visibility", id: "visibility" },
  // { label: "Data privacy", id: "data-privacy" },
  // { label: "Advertising data", id: "advertising-data" },
  // { label: "Notifications", id: "notifications" },
];

interface ClientComponentProps {
  user: any;
  sessionId: string;
}

const ClientComponent: React.FC<ClientComponentProps> = ({
  user,
  sessionId,
}) => {
  const router = useRouter();
  const [sectionId, setSectionId] = useState("account-preferences");

  // Update state when hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const newSectionId =
        window.location.hash?.replace("#", "") || "account-preferences";
      setSectionId(newSectionId);
    };

    handleHashChange(); // Set the initial section

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const handleSectionClick = (section: string) => {
    router.replace(`#${section}`, { scroll: false });
    setSectionId(section); // Manually trigger the state change
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border bg-gray-100 text-slate-900 p-4">
        <h1 className="text-2xl text-bold mb-2">Settings</h1>
        <ul>
          {sections.map((section) => (
            <li
              key={section.id}
              className={`cursor-pointer py-2 px-4 rounded ${
                sectionId === section.id
                  ? "bg-gray-300 border-l-4 border-blue-400"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => handleSectionClick(section.id)}
            >
              {section.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4 bg-slate-100 shadow-md text-black">
        {sectionId === "account-preferences" && (
          <AccountPreferences user={user} />
        )}
        {sectionId === "sign-in-security" && <SignInSecurity user={user} />}
        {/* {sectionId === "visibility" && <Visibility />} */}
        {/* {sectionId === "data-privacy" && <DataPrivacy />} */}
        {/* {sectionId === "advertising-data" && <AdvertisingData />} */}
        {/* {sectionId === "notifications" && <Notifications />} */}
      </div>
    </div>
  );
};

// Dummy components for each section
const Visibility = () => <div>Visibility Content</div>;
const DataPrivacy = () => <div>Data Privacy Content</div>;
const AdvertisingData = () => <div>Advertising Data Content</div>;
const Notifications = () => <div>Notifications Content</div>;

export default ClientComponent;
