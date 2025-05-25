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
import { Teacher } from "@/models/teacher"; // Import Teacher model
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
// Import Teacher API functions
import { getTeacherById, updateTeacher, deleteTeacher } from "@/api/teacherApi";
// import axiosInstance from "@/api/axiosInstance"; // Không cần thiết ở đây nếu đã import axios

const TeacherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState<Teacher | null>(null); // Đổi từ student sang teacher
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // Đổi từ phoneNumber sang phone
    dateOfBirth: "",
    password: "",
    classInCharge: "", // Đổi từ grade sang classInCharge
    // rollNumber không tồn tại trong Teacher, loại bỏ nó
    avatar: "",
    gender: "" as "male" | "female" | "", // Đảm bảo kiểu dữ liệu đúng
  });

  // Fetch teacher data from backend API
  useEffect(() => {
    if (id) {
      const teacherId = parseInt(id, 10);
      setIsLoading(true);
      getTeacherById(teacherId) // Gọi API getTeacherById
        .then((data) => {
          setTeacher(data);
          setFormData({
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "", // Cập nhật phone
            dateOfBirth: data.dateOfBirth || "",
            password: data.password || "",
            classInCharge: data.classInCharge || "", // Cập nhật classInCharge
            avatar: data.avatar || "",
            gender: data.gender || "",
          });
          setConfirmPassword(data.password || "");
        })
        .catch((error) => {
          console.error("Failed to fetch teacher:", error);
          setTeacher(null); // Đặt teacher thành null nếu có lỗi
        })
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> // Thêm HTMLSelectElement cho dropdown
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!teacher) return; // Kiểm tra teacher thay vì student

    if (formData.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    const payload = {
      ...formData,
    };

    // Nếu password rỗng, xóa trường password để backend không bắt lỗi
    if (!payload.password) {
      delete payload.password;
    }

    try {
      await updateTeacher(teacher.id, payload); // Gọi API updateTeacher
      alert("Teacher information updated successfully");
      navigate("/teachers"); // Điều hướng về trang danh sách giáo viên
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error(error.response?.data);
        alert(
          "Failed to update teacher:\n" +
            JSON.stringify(error.response?.data, null, 2)
        );
      } else {
        console.error(error);
        alert("An unexpected error occurred");
      }
    }
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!teacher) return; // Kiểm tra teacher thay vì student
    try {
      await deleteTeacher(teacher.id); // Gọi API deleteTeacher
      alert("Teacher deleted successfully");
      navigate("/teachers"); // Điều hướng về trang danh sách giáo viên
    } catch (error) {
      alert("Failed to delete teacher. Please try again.");
      console.error(error);
    }
  };

  const handleAvatarChange = () => {
    // Sử dụng ảnh ngẫu nhiên từ pravatar hoặc một dịch vụ khác cho giáo viên
    const randomId = Math.floor(Math.random() * 70) + 1;
    setFormData((prev) => ({
      ...prev,
      avatar: `https://i.pravatar.cc/150?img=${randomId}`,
    }));
  };

  if (isLoading) {
    return <div className="p-5">Loading teacher information...</div>; // Sửa text
  }

  if (!teacher) {
    return <div className="p-5">Teacher not found</div>; // Sửa text
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5">
        <div className="flex items-center">
          <Link to="/teachers" className="mr-4">
            {" "}
            {/* Sửa link */}
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Teacher </h1> {/* Sửa tiêu đề */}
        </div>
      </div>

      {/* Teacher Avatar */}
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
            <Label htmlFor="phone">Mobile Number</Label>{" "}
            {/* Sửa Label và name */}
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
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
            <Label htmlFor="classInCharge">Class In Charge</Label>{" "}
            {/* Sửa Label và name */}
            <Input
              id="classInCharge"
              name="classInCharge"
              value={formData.classInCharge}
              onChange={handleInputChange}
              className="border-gray-300"
            />
          </div>

          {/* rollNumber không có trong Teacher, loại bỏ */}
          {/* <div className="space-y-2">
            <Label htmlFor="rollNumber">ID Number</Label>
            <Input
              id="rollNumber"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleInputChange}
              className="border-gray-300"
            />
          </div> */}

          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange} // Đảm bảo handleInputChange chấp nhận HTMLSelectElement
              className="border-gray-300 w-full p-2 rounded"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              {/* Thêm các giá trị gender khác nếu cần */}
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
              This will permanently delete this teacher and remove their data
              from the system.
            </AlertDialogDescription>{" "}
            {/* Sửa text */}
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

export default TeacherDetailPage;
