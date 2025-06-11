import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Calendar, Utensils, Megaphone, ArrowLeft } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";
import { format } from "date-fns";
import { getStudentById } from "@/api/studentApi";

interface Student {
  id: number;
  name: string;
  grade: string;
  avatar: string;
  rollNumber: string;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
}

const StudentHome = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentId = location.state?.studentId;
        if (studentId) {
          const data = await getStudentById(studentId);
          setStudent(data);
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [location.state?.studentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-school-primary"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-bold text-red-500">Error</h1>
          <p className="text-gray-600">Student information not found</p>
        </div>
      </div>
    );
  }

  const currentDate = new Date();
  const formattedDate = format(currentDate, "EEEE, MMMM d, yyyy");

  const features = [
    {
      title: "Attendance",
      icon: Calendar,
      description: "Mark your daily attendance",
      link: "/student/attendance",
      color: "#4285F4",
    },
    {
      title: "Menu",
      icon: Utensils,
      description: "View daily menu",
      link: "/student/menu",
      color: "#34A853",
    },
    {
      title: "Announcements",
      icon: Megaphone,
      description: "View latest announcements",
      link: "/student/announcements",
      color: "#EA4335",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 shadow-md">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate("/")}
            className="mr-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Student Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-16 h-16 rounded-full border-2 border-white"
          />
          <div>
            <h2 className="text-lg font-semibold">Welcome, {student.name}</h2>
            <p className="text-sm opacity-90">Class: {student.grade}</p>
            <p className="text-sm opacity-90">{formattedDate}</p>
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="px-5 mt-5">
        <div className="grid grid-cols-1 gap-4">
          {features.map((feature, index) => (
            <div
              key={index}
              onClick={() =>
                navigate(feature.link, { state: { studentId: student.id } })
              }
              className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-4 cursor-pointer hover:shadow-md transition-shadow"
            >
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: `${feature.color}20` }}
              >
                <feature.icon
                  className="h-6 w-6"
                  style={{ color: feature.color }}
                />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default StudentHome;
