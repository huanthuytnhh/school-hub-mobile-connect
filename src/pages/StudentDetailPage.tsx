import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  User,
  Camera,
  Eye,
  EyeOff,
  Save,
  Trash2,
} from "lucide-react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BottomNavBar from "@/components/BottomNavBar";
import { Student } from "@/models/student";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { getStudentById, updateStudent, deleteStudent } from "@/api/studentApi"; // Giả sử bạn export api functions từ đây
// import axios from "axios";
import axiosInstance from "@/api/axiosInstance";
const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    dateOfBirth: "",
    password: "",
    grade: "",
    rollNumber: "",
    avatar: "",
    gender: "", // thêm dòng này
  });

  // Fetch student data from backend API
  useEffect(() => {
    if (id) {
      const studentId = parseInt(id, 10);
      setIsLoading(true);
      getStudentById(studentId)
        .then((data) => {
          setStudent(data);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phoneNumber: data.phoneNumber || "",
            dateOfBirth: data.dateOfBirth || "",
            password: data.password || "",
            grade: data.grade || "",
            rollNumber: data.rollNumber || "",
            avatar: data.avatar || "",
            gender: data.gender || "", // thêm dòng này
          });
          setConfirmPassword(data.password || "");
        })
        .catch(() => {
          setStudent(null);
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!student) return;

    if (formData.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    // Create payload with proper typing
    const payload: Partial<Student> = {
      name: formData.name,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      dateOfBirth: formData.dateOfBirth,
      grade: formData.grade,
      rollNumber: formData.rollNumber,
      avatar: formData.avatar,
    };

    // Only add gender if it's a valid value
    if (formData.gender && (formData.gender === "male" || formData.gender === "female" || formData.gender === "other")) {
      payload.gender = formData.gender as "male" | "female" | "other";
    }

    // Only add password if it's not empty
    if (formData.password) {
      payload.password = formData.password;
    }

    try {
      await updateStudent(student.id, payload);
      alert("Student information updated successfully");
      navigate("/students");
    } catch (error: any) {
      console.error(error);
      if (error.response?.data) {
        alert(
          "Failed to update student:\n" +
            JSON.stringify(error.response.data, null, 2)
        );
      } else {
        alert("An unexpected error occurred");
      }
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!student) return;
    try {
      await deleteStudent(student.id);
      alert("Student deleted successfully");
      navigate("/students");
    } catch (error) {
      alert("Failed to delete student. Please try again.");
      console.error(error);
    }
  };

  const handleAvatarChange = () => {
    const randomId = Math.floor(Math.random() * 70) + 1;
    setFormData((prev) => ({
      ...prev,
      avatar: `https://i.pravatar.cc/150?img=${randomId}`,
    }));
  };

  if (isLoading) {
    return <div className="p-5">Loading student information...</div>;
  }

  if (!student) {
    return <div className="p-5">Student not found</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5">
        <div className="flex items-center">
          <Link to="/students" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Details</h1>
        </div>
      </div>

      {/* Student Avatar */}
      <div className="flex justify-center -mt-8">
        <div className="relative">
          <div className="h-24 w-24 rounded-full bg-school-secondary flex items-center justify-center text-white border-4 border-white overflow-hidden shadow-md">
            {formData.avatar ? (
              <img
                src={formData.avatar}
                alt={formData.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={40} />
            )}
          </div>
          <button
            className="absolute bottom-0 right-0 bg-school-primary text-white rounded-full p-1.5 shadow-sm"
            onClick={handleAvatarChange}
          >
            <Camera size={16} />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="px-5 mt-6">
        <div className="bg-white rounded-xl shadow-sm p-5 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNumber">Mobile Number</Label>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Class</Label>
            <Input
              id="grade"
              name="grade"
              value={formData.grade}
              onChange={handleInputChange}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="rollNumber">ID Number</Label>
            <Input
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleInputChange}
              className="border-gray-300"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="border-gray-300 w-full p-2 rounded"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="border-gray-300 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="border-gray-300 pr-10"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button
              className="flex-1 bg-school-primary hover:bg-school-primary/90"
              onClick={handleSave}
            >
              <Save className="mr-2 h-4 w-4" />
              Save
            </Button>
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600"
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this student and remove their data
              from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNavBar />
    </div>
  );
};

export default StudentDetailPage;
// Note: Ensure you have the necessary API functions in your studentApi file
