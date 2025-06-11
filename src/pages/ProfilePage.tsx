import React, { useState, useEffect } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import {
  ArrowLeft,
  LogOut,
  User,
  Mail,
  Calendar,
  Phone,
  BookUser,
  Book,
  GraduationCap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserRole } from "@/api/teacherApi";

const ProfilePage = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const [userDetails, setUserDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        if (user?.emailAddresses?.[0]?.emailAddress) {
          const email = user.emailAddresses[0].emailAddress;
          const response = await getUserRole(email);
          setUserDetails(response.user);
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [user]);

  const handleSignOut = () => {
    signOut();
  };

  const getUserInitials = () => {
    if (user?.fullName) {
      return user.fullName
        .split(" ")
        .map((name) => name[0])
        .join("")
        .toUpperCase();
    }
    return user?.emailAddresses?.[0]?.emailAddress[0]?.toUpperCase() || "U";
  };

  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-school-light flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-school-light">
      {/* Header */}
      <div className="bg-school-primary text-white p-4">
        <div className="flex items-center gap-3">
          <Link to="/">
            <ArrowLeft size={24} />
          </Link>
          <h1 className="text-xl font-bold">Profile</h1>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* User Info Card */}
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={userDetails?.avatar || user?.imageUrl}
                  alt="Profile"
                />
                <AvatarFallback className="text-xl bg-school-primary text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">
              {userDetails?.name || user?.fullName || "User Profile"}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Email */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="text-school-primary" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </p>
              </div>
            </div>

            {/* Phone Number */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="text-school-primary" size={20} />
              <div>
                <p className="text-sm text-gray-600">Phone Number</p>
                <p className="font-medium">
                  {userDetails?.phoneNumber || "Not provided"}
                </p>
              </div>
            </div>

            {/* Student ID */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <BookUser className="text-school-primary" size={20} />
              <div>
                <p className="text-sm text-gray-600">Student ID</p>
                <p className="font-medium">
                  {userDetails?.rollNumber || "N/A"}
                </p>
              </div>
            </div>

            {/* Class */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Book className="text-school-primary" size={20} />
              <div>
                <p className="text-sm text-gray-600">Class</p>
                <p className="font-medium">{userDetails?.grade || "N/A"}</p>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="text-school-primary" size={20} />
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium">
                  {userDetails?.dateOfBirth
                    ? formatDate(userDetails.dateOfBirth)
                    : "Unknown"}
                </p>
              </div>
            </div>

            {/* Gender */}
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="text-school-primary" size={20} />
              <div>
                <p className="text-sm text-gray-600">Gender</p>
                <p className="font-medium capitalize">
                  {userDetails?.gender || "Not specified"}
                </p>
              </div>
            </div>

            {/* Attendance Status */}
            {/* <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <GraduationCap className="text-school-primary" size={20} />
              <div>
                <p className="text-sm text-gray-600">Attendance Status</p>
                <p className="font-medium">
                  {userDetails?.isPresent ? (
                    <span className="text-green-600">Present</span>
                  ) : (
                    <span className="text-red-600">Absent</span>
                  )}
                </p>
              </div>
            </div> */}
          </CardContent>
        </Card>

        {/* Actions */}
        <Card>
          <CardContent className="p-4">
            <Button
              onClick={handleSignOut}
              variant="destructive"
              className="w-full flex items-center gap-2"
            >
              <LogOut size={20} />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfilePage;
