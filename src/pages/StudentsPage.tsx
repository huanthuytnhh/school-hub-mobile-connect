import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, User } from "lucide-react";
import { FaMale, FaFemale } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import BottomNavBar from "@/components/BottomNavBar";
import { Student } from "@/models/student";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog, // Import AlertDialog
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { getStudents, createStudent, deleteStudent } from "@/api/studentApi";

const StudentsPage: React.FC = () => {
  const location = useLocation(); // Get the current location
  const [searchQuery, setSearchQuery] = useState("");
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState("ALL"); // Default to "ALL"
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // State cho hộp thoại xác nhận xóa
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDeleteId, setStudentToDeleteId] = useState<number | null>(
    null
  );

  useEffect(() => {
    // Check for class query parameter in the URL
    const params = new URLSearchParams(location.search);
    const classParam = params.get("class");
    if (classParam) {
      setSelectedClass(classParam); // Set selectedClass to the class from the URL
    }
  }, [location.search]);

  // Lấy danh sách students từ API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true); // Bắt đầu loading
        setError(null); // Reset lỗi
        const data = await getStudents();
        setStudents(data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
        if (err instanceof Error) {
          setError(err.message || "An unknown error occurred.");
        } else {
          setError("An unknown error occurred while fetching students.");
        }
      } finally {
        setLoading(false); // Kết thúc loading
      }
    };

    fetchData();
  }, []);

  // Lấy danh sách lớp duy nhất từ students
  // Đảm bảo "ALL" luôn là lựa chọn đầu tiên và sắp xếp các lớp còn lại
  const uniqueClasses = Array.from(
    new Set(students.map((student) => student.grade))
  ).sort();
  const classes =
    selectedClass !== "ALL" ? [selectedClass] : ["ALL", ...uniqueClasses];

  // Tên giáo viên theo lớp (ví dụ demo)
  const getTeacherName = (classValue: string) => {
    const teacherMap: { [key: string]: string } = {
      "5/1": "Mrs. Quan",
      "5/2": "Mr. Thanh",
      "6/1": "Mrs. Linh",
      "6/2": "Mr. Tuan",
      ALL: "School Principal", // Thêm giáo viên cho ALL
    };
    return teacherMap[classValue] || "Unknown Teacher";
  };

  // Lọc students theo lớp và search query
  const filteredStudents = students.filter(
    (student) =>
      (selectedClass === "ALL" || student.grade === selectedClass) &&
      (student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.rollNumber.includes(searchQuery))
  );

  // Khi click vào student chuyển sang trang chi tiết
  const handleStudentClick = (studentId: number) => {
    navigate(`/students/${studentId}`);
  };

  // Thêm student mẫu (test tạo mới)
  const handleAddDummyStudent = async () => {
    try {
      const newStudent = await createStudent({
        name: "Dummy Student " + Math.floor(Math.random() * 100),
        rollNumber: String(Math.floor(Math.random() * 10000)),
        grade: selectedClass === "ALL" ? "5/1" : selectedClass, // Đặt lớp mặc định nếu là "ALL"
        gender: Math.random() > 0.5 ? "male" : "female",
        email: `dummy${Math.floor(Math.random() * 1000)}@example.com`,
        phoneNumber: `0${Math.floor(100000000 + Math.random() * 900000000)}`,
        dateOfBirth: "2015-01-01",
      });
      setStudents((prev) => [...prev, newStudent]);
    } catch (err) {
      console.error("Failed to create student:", err);
    }
  };

  // Mở hộp thoại xác nhận xóa
  const handleDeleteStudent = (id: number) => {
    setStudentToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  // Thực hiện xóa sau khi xác nhận
  const confirmDelete = async () => {
    if (studentToDeleteId === null) return;
    try {
      await deleteStudent(studentToDeleteId);
      setStudents((prev) => prev.filter((s) => s.id !== studentToDeleteId));
      alert("Student deleted successfully"); // Hoặc dùng Toast Notification
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete student. Please try again.");
    } finally {
      setIsDeleteDialogOpen(false); // Đóng hộp thoại
      setStudentToDeleteId(null); // Reset ID
    }
  };

  // Hiển thị trạng thái loading và error đẹp hơn
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-700 text-lg">
        <svg
          className="animate-spin h-8 w-8 mr-3 text-school-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading students...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-red-600 text-lg p-4 text-center">
        <svg
          className="h-10 w-10 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p>Error: {error}</p>
        <p className="text-gray-500 text-sm mt-2">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 shadow-md">
        {" "}
        {/* Thêm shadow */}
        <div className="flex items-center">
          <Link to="/" className="mr-4 transition-transform active:scale-95">
            {" "}
            {/* Hiệu ứng click */}
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Students</h1>
        </div>
        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            className="pl-10 bg-white/90 text-gray-800 border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-school-secondary" // Bo góc, shadow, focus ring
            placeholder="Enter Name or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Nút thêm student mẫu */}
        <button
          onClick={handleAddDummyStudent}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 active:scale-95 transition-all" // Bo góc, shadow, hiệu ứng click
        >
          + Add Dummy Student
        </button>
      </div>

      {/* Class Selector */}
      <div className="px-5 mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-school-secondary/20 rounded-xl shadow-md p-4 mb-2 w-full text-left flex flex-col focus:outline-none focus:ring-2 focus:ring-school-primary transition-all">
            {" "}
            {/* shadow-md, focus ring */}
            <h2 className="text-school-primary font-semibold">
              Class {selectedClass}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {getTeacherName(selectedClass)}
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full max-w-[90vw] bg-white rounded-lg shadow-lg border border-gray-200">
            {" "}
            {/* Bo góc, shadow, border */}
            {classes.map((classItem) => (
              <DropdownMenuItem
                key={classItem}
                onClick={() => setSelectedClass(classItem)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded-md mx-1 my-0.5" // Thêm padding, hover, bo góc nhỏ
              >
                Class {classItem}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Student List */}
      <div className="px-5 mt-2">
        <h2 className="text-lg font-bold mb-4 text-gray-700">
          Student Directory
        </h2>

        <div className="space-y-3">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all transform hover:scale-[1.01]" // Shadow đẹp hơn, hiệu ứng hover phóng to nhẹ
                onClick={() => handleStudentClick(student.id)}
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-school-secondary flex items-center justify-center text-white mr-3 overflow-hidden border-2 border-school-primary/50 flex-shrink-0">
                    {" "}
                    {/* Bo viền ảnh đẹp hơn, tránh co giãn */}
                    {student.avatar ? (
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User size={20} />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    {" "}
                    {/* Đảm bảo nội dung không tràn */}
                    <div className="flex items-center">
                      <h3 className="font-semibold text-gray-800 text-base truncate">
                        {student.name}
                      </h3>{" "}
                      <div className="ml-2 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center min-w-[30px] min-h-[20px]">
                        {student.gender === "male" ? (
                          <FaMale size={14} />
                        ) : (
                          <FaFemale size={14} />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap text-xs text-gray-500 mt-1 gap-x-2">
                      <span className="font-medium text-school-secondary">
                        Class: {student.grade}
                      </span>
                      {/* Chỉ hiển thị dấu chấm nếu cả class và rollNumber đều có */}
                      {student.grade && student.rollNumber && (
                        <span className="mx-0">•</span>
                      )}
                      <span className="truncate flex-1">
                        ID: {student.rollNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  className="text-sm text-red-600 ml-4 p-2 rounded-full hover:bg-red-50 transition-colors active:scale-90 flex-shrink-0" // Button tròn, hover, click
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteStudent(student.id); // Gọi hàm để mở hộp thoại xác nhận
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-lg">
              No students found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen} // Cho phép đóng dialog bằng cách click bên ngoài hoặc nhấn Esc
      >
        <AlertDialogContent className="rounded-xl shadow-lg">
          {" "}
          {/* Bo góc và shadow đẹp hơn cho dialog */}
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-800">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This will permanently delete this student and remove their data
              from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
              Cancel
            </AlertDialogCancel>{" "}
            {/* Styling nút cancel */}
            <AlertDialogAction
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors" // Styling nút delete
              onClick={confirmDelete} // Gọi hàm xóa khi xác nhận
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

export default StudentsPage;
