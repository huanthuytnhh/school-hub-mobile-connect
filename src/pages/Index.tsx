
import React, { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import DashboardStats from "@/components/DashboardStats";
import FeatureCard from "@/components/FeatureCard";
import BottomNavBar from "@/components/BottomNavBar";
import {
  User,
  Utensils,
  MessageCircle,
  Calendar,
  Megaphone,
  BarChart,
} from "lucide-react";
import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(false);
  const navigate = useNavigate();
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString("default", {
    month: "long",
  })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  useEffect(() => {
    if (isSignedIn && user?.emailAddresses?.[0]?.emailAddress) {
      setLoadingRole(true);
      // Simulate role checking - you can replace this with actual API call
      setTimeout(() => {
        const email = user.emailAddresses[0].emailAddress;
        let userRole = "guest";
        
        // Simple role assignment based on email (you can customize this)
        if (email.includes("admin")) {
          userRole = "admin";
        } else if (email.includes("teacher")) {
          userRole = "teacher";
        } else if (email.includes("student")) {
          userRole = "student";
        }
        
        setRole(userRole);
        setLoadingRole(false);
        
        // Auto-redirect based on role
        if (userRole === "admin") navigate("/teachers");
        else if (userRole === "teacher") navigate("/check");
        else if (userRole === "student") navigate("/students");
      }, 1000);
    }
  }, [isSignedIn, user, navigate]);

  const features = [
    { title: "Food", icon: Utensils, color: "#4285F4", link: "/food" },
    { title: "Student", icon: User, color: "#4285F4", link: "/students" },
    { title: "Teacher", icon: User, color: "#4285F4", link: "/teachers" },
    { title: "Daily Check", icon: Calendar, color: "#34A853", link: "/check" },
    {
      title: "Announce",
      icon: Megaphone,
      color: "#EA4335",
      link: "/announcements",
    },
    { title: "Analyst", icon: BarChart, color: "#FBBC05", link: "/analytics" },
  ];

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-school-light">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Welcome to School Management
          </h2>
          <p className="text-gray-600 mb-6">Please sign in to continue</p>
        </div>
      </div>
    );
  }

  if (loadingRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-school-light">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-school-primary mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading your profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-school-light pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 rounded-b-3xl shadow-md">
        <div className="mb-2">
          <h1 className="text-xl font-bold">Hi, Welcome Back</h1>
          <p className="text-sm opacity-90">
            {user?.fullName ||
              user?.username ||
              user?.emailAddresses?.[0]?.emailAddress}
          </p>
          {role && (
            <p className="text-xs opacity-75 capitalize">Role: {role}</p>
          )}
        </div>

        {/* Stats Cards */}
        <DashboardStats
          attendanceCount={360}
          attendanceTotal={450}
          teachersCount={25}
          teachersTotal={125}
          date={formattedDate}
          className="mt-5 animate-fade-in"
        />
      </div>

      {/* Feature Grid */}
      <div className="px-5 mt-5">
        <div className="grid grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              icon={feature.icon}
              color={feature.color}
              link={feature.link}
              className={`animate-fade-in delay-${index * 100}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default Index;
