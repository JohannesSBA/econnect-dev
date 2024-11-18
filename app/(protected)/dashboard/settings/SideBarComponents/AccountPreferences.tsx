"use client";

import React, { useState } from "react";
import {
  Button,
  Input,
  Select,
  SelectItem,
  Textarea,
  Switch,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@nextui-org/react";
import { toast } from "sonner";
import axios from "axios";

interface User {
  firstName: string;
  lastName: string;
  bio: string;
  title: string;
  location: string;
  pronouns: string;
}

interface AppProps {
  user: User;
}

export default function AccountPreferences({ user }: AppProps) {
  const [formData, setFormData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    pronouns: user.pronouns || "",
    bio: user.bio || "",
    title: user.title || "",
    country: "",
    city: "",
    streetAddress: "",
    stateProvince: "",
    pushNotifications: "everything",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    toast.loading("Updating your profile");
    try {
      const location = `${formData.streetAddress}, ${formData.city}, ${formData.stateProvince}, ${formData.country}`;
      const res = await axios.put("/api/user/update", {
        ...formData,
        location,
      });
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 w-full h-full mx-auto">
      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Personal Information</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
            <Input
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <Select
            label="Pronouns"
            name="pronouns"
            value={formData.pronouns}
            onChange={handleInputChange}
          >
            <SelectItem key="he/him" value="he/him">
              He/Him
            </SelectItem>
            <SelectItem key="she/her" value="she/her">
              She/Her
            </SelectItem>
            <SelectItem key="they/them" value="they/them">
              They/Them
            </SelectItem>
          </Select>
          <Input
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
          />
          <Textarea
            label="Bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
          />
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Location</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Street Address"
            name="streetAddress"
            value={formData.streetAddress}
            onChange={handleInputChange}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
            />
            <Input
              label="State/Province"
              name="stateProvince"
              value={formData.stateProvince}
              onChange={handleInputChange}
            />
          </div>
          <Select
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
          >
            {[
              "United States",
              "Canada",
              "United Kingdom",
              "Australia",
              "Germany",
              "France",
              "Japan",
            ].map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </Select>
        </CardBody>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-2xl font-bold">Notifications</h2>
        </CardHeader>
        <CardBody>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Push Notifications</h3>
              <p className="text-sm text-gray-500">
                Receive push notifications for important updates
              </p>
            </div>
            <Switch defaultSelected />
          </div>
        </CardBody>
      </Card>

      <div className="flex justify-end">
        <Button color="primary" type="submit">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
