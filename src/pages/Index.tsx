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
import { useUser, SignInButton, SignUpButton } from "@clerk/clerk-react";
import { getUserRole } from "@/api/teacherApi";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { toast } = useToast();
  const { user, isSignedIn } = useUser();
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(false);
  const [teacherClass, setTeacherClass] = useState<string | null>(null);
  const navigate = useNavigate();
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString("default", {
    month: "long",
  })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  useEffect(() => {
    const fetchRole = async () => {
      if (isSignedIn && user?.emailAddresses?.[0]?.emailAddress) {
        setLoadingRole(true);
        try {
          const email = user.emailAddresses[0].emailAddress;
          const response = await getUserRole(email); // API returns role and user details
          console.log("Role response:", response);
          const { role: userRole, user: userDetails } = response;
          setRole(userRole);
          console.log("role", userRole);
          if (userRole === "teacher" && userDetails?.classInCharge) {
            // Store classInCharge for teacher
            setTeacherClass(userDetails.classInCharge);
          }
        } catch (e) {
          setRole("guest");
          setTeacherClass(null);
        } finally {
          setLoadingRole(false);
        }
      }
    };
    fetchRole();
  }, [isSignedIn, user]);

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100">
        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-10 max-w-md w-full text-center animate-fade-in">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Welcome to School Management
          </h1>
          <p className="text-gray-600 mb-8">
            Manage attendance, announcements, food, and more in one modern
            platform.
          </p>
          <div className="flex flex-col gap-4 mb-6">
            <SignInButton mode="modal">
              <button className="w-full py-3 px-6 rounded-xl bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="w-full py-3 px-6 rounded-xl bg-green-500 text-white font-semibold text-lg shadow hover:bg-green-600 transition">
                Sign Up
              </button>
            </SignUpButton>
          </div>
          <div className="text-xs text-gray-400">
            © {new Date().getFullYear()} School Management. All rights reserved.
          </div>
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

  // Only admin can see all features, others see filtered
  const filteredFeatures =
    role === "admin"
      ? features
      : features.filter((f) => {
          if (role === "teacher") {
            // Teachers can access all features but limited to their class
            return ["Daily Check", "Announce", "Analyst", "Student"].includes(
              f.title
            );
          }
          if (role === "student")
            return ["Food", "Announce", "Analyst"].includes(f.title);
          return false;
        });

  // Ensure navigation includes class-specific context for teachers
  const handleFeatureClick = (link: string) => {
    if (role === "teacher" && teacherClass) {
      navigate({ pathname: link, search: `?class=${teacherClass}` });
    } else {
      navigate(link);
    }
  };

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
          {filteredFeatures.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              icon={feature.icon}
              color={feature.color}
              onClick={() => handleFeatureClick(feature.link)}
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
