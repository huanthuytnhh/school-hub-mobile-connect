import React from "react";
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

const Index = () => {
  const { toast } = useToast();
  const currentDate = new Date();
  const formattedDate = `${currentDate.toLocaleString("default", {
    month: "long",
  })} ${currentDate.getDate()}, ${currentDate.getFullYear()}`;

  // React.useEffect(() => {
  //   toast({
  //     title: "Welcome back",
  //     description: "You've successfully logged in to the School Management App",
  //     duration: 3000,
  //   });
  // }, [toast]);

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

  return (
    <div className="flex flex-col min-h-screen bg-school-light pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 rounded-b-3xl shadow-md">
        <div className="mb-2">
          <h1 className="text-xl font-bold">Hi, Welcome Back</h1>
          <p className="text-sm opacity-90">M. Noah</p>
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
