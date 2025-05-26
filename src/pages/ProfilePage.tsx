
import React from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { ArrowLeft, LogOut, User, Mail, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ProfilePage = () => {
  const { user } = useUser();
  const { signOut } = useClerk();

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
                <AvatarImage src={user?.imageUrl} alt="Profile" />
                <AvatarFallback className="text-xl bg-school-primary text-white">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-xl">
              {user?.fullName || "User Profile"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="text-school-primary" size={20} />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">
                  {user?.emailAddresses?.[0]?.emailAddress}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <User className="text-school-primary" size={20} />
              <div>
                <p className="text-sm text-gray-600">Username</p>
                <p className="font-medium">
                  {user?.username || "Not set"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="text-school-primary" size={20} />
              <div>
                <p className="text-sm text-gray-600">Member since</p>
                <p className="font-medium">
                  {user?.createdAt ? formatDate(user.createdAt) : "Unknown"}
                </p>
              </div>
            </div>
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
