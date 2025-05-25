import React, { useState, useEffect } from "react";
import { ArrowLeft, Search, User } from "lucide-react";
import { FaMale, FaFemale } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import BottomNavBar from "@/components/BottomNavBar";
import { Teacher } from "@/models/teacher";
import { getTeachers, createTeacher, deleteTeacher } from "@/api/teacherApi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

const TeachersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // State cho hộp thoại xác nhận xóa
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [teacherToDeleteId, setTeacherToDeleteId] = useState<number | null>(
    null
  );

  // Lấy danh sách teachers từ API khi component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getTeachers();
        setTeachers(data);
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        if (err instanceof Error) {
          setError(err.message || "An unknown error occurred.");
        } else {
          setError("An unknown error occurred while fetching teachers.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lấy danh sách các Grade duy nhất từ teachers
  const uniqueGrades = Array.from(
    new Set(
      teachers
        .map((teacher) => {
          const gradeMatch = teacher.classInCharge?.match(/^(\d+)/);
          return gradeMatch ? `Grade ${gradeMatch[1]}` : null;
        })
        .filter((grade) => grade !== null) as string[]
    )
  ).sort((a, b) => {
    const numA = parseInt(a.replace("Grade ", ""));
    const numB = parseInt(b.replace("Grade ", ""));
    return numA - numB;
  });

  const grades = ["All", ...uniqueGrades];

  // Tên giáo viên chủ nhiệm/tên chính theo khối (ví dụ demo)
  const getMainTeacher = (grade: string) => {
    const mainTeachers: { [key: string]: string } = {
      "Grade 1": "Mrs. Emily Brown",
      "Grade 2": "Mr. James Wilson",
      "Grade 3": "Prof. Sarah Johnson",
      "Grade 4": "Dr. Robert Smith",
      "Grade 5": "Ms. Jessica Davis",
      All: "Principal Wong",
    };
    return mainTeachers[grade] || "Unknown";
  };

  // Lọc teachers theo grade và search query
  const filteredTeachers = teachers.filter(
    (teacher) =>
      (selectedGrade === "All" ||
        (teacher.classInCharge &&
          teacher.classInCharge.startsWith(
            selectedGrade.replace("Grade ", "")
          ))) &&
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Khi click vào teacher chuyển sang trang chi tiết
  const handleTeacherClick = (teacherId: number) => {
    navigate(`/teachers/${teacherId}`);
  };

  // Thêm teacher mẫu (test tạo mới)
  const handleAddDummyTeacher = async () => {
    try {
      const newTeacher = await createTeacher({
        name: "New Teacher " + Math.floor(Math.random() * 100),
        email: `teacher${Math.floor(Math.random() * 1000)}@example.com`,
        phone: `09${Math.floor(100000000 + Math.random() * 900000000)}`,
        gender: Math.random() > 0.5 ? "male" : "female",
        classInCharge:
          selectedGrade !== "All"
            ? selectedGrade.replace("Grade ", "") + "/1"
            : "N/A",
      });
      setTeachers((prev) => [...prev, newTeacher]);
    } catch (err) {
      console.error("Failed to create teacher:", err);
    }
  };

  // Mở hộp thoại xác nhận xóa
  const handleDeleteTeacher = (id: number) => {
    setTeacherToDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  // Thực hiện xóa sau khi xác nhận
  const confirmDelete = async () => {
    if (teacherToDeleteId === null) return;
    try {
      await deleteTeacher(teacherToDeleteId);
      setTeachers((prev) => prev.filter((t) => t.id !== teacherToDeleteId));
      alert("Teacher deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete teacher. Please try again.");
    } finally {
      setIsDeleteDialogOpen(false);
      setTeacherToDeleteId(null);
    }
  };

  // Hiển thị trạng thái loading và error đầy đủ màn hình
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
        Loading teachers...
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
            {/* Thêm hiệu ứng click */}
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Teachers</h1>
        </div>
        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            className="pl-10 bg-white/90 text-gray-800 border-0 rounded-lg shadow-sm focus:ring-2 focus:ring-school-secondary" // Bo góc, shadow, focus ring
            placeholder="Search by name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {/* Nút thêm teacher mẫu */}
        <button
          onClick={handleAddDummyTeacher}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 active:scale-95 transition-all" // Bo góc, shadow, hiệu ứng click
        >
          + Add Dummy Teacher
        </button>
      </div>

      {/* Grade Selector */}
      <div className="px-5 mt-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-school-secondary/20 rounded-xl shadow-md p-4 mb-2 w-full text-left flex flex-col focus:outline-none focus:ring-2 focus:ring-school-primary transition-all">
            {" "}
            {/* shadow-md, focus ring */}
            <h2 className="text-school-primary font-semibold">
              {selectedGrade === "All"
                ? "All Teachers"
                : `${selectedGrade} Teachers`}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {getMainTeacher(selectedGrade)}
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full max-w-[90vw] bg-white rounded-lg shadow-lg border border-gray-200">
            {" "}
            {/* Bo góc, shadow, border */}
            {grades.map((gradeItem) => (
              <DropdownMenuItem
                key={gradeItem}
                onClick={() => setSelectedGrade(gradeItem)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 transition-colors rounded-md mx-1 my-0.5" // Thêm padding, hover, bo góc nhỏ
              >
                {gradeItem === "All" ? "All Teachers" : `${gradeItem} Teachers`}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Teacher List */}
      <div className="px-5 mt-2">
        <h2 className="text-lg font-bold mb-4 text-gray-700">
          Teacher Directory
        </h2>
        <div className="space-y-3">
          {filteredTeachers.length > 0 ? (
            filteredTeachers.map((teacher) => (
              <div
                key={teacher.id}
                className="bg-white p-4 rounded-xl shadow-md flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-all transform hover:scale-[1.01]" // Shadow đẹp hơn, hiệu ứng hover phóng to nhẹ
                onClick={() => handleTeacherClick(teacher.id)}
              >
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-school-secondary flex items-center justify-center text-white mr-3 overflow-hidden border-2 border-school-primary/50 flex-shrink-0">
                    {" "}
                    {/* Bo viền ảnh đẹp hơn, tránh co giãn */}
                    {teacher.avatar ? (
                      <img
                        src={teacher.avatar}
                        alt={teacher.name}
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
                        {teacher.name}
                      </h3>{" "}
                      {/* text-base, truncate */}
                      <div className="ml-2 text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center min-w-[30px] min-h-[20px]">
                        {" "}
                        {/* căn giữa icon */}
                        {teacher.gender === "male" ? (
                          <FaMale size={14} />
                        ) : teacher.gender === "female" ? (
                          <FaFemale size={14} />
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-wrap text-xs text-gray-500 mt-1 gap-x-2">
                      {" "}
                      {/* gap-x để khoảng cách giữa các span */}
                      {teacher.classInCharge && (
                        <span className="font-medium text-school-secondary">
                          Class: {teacher.classInCharge}
                        </span>
                      )}
                      {/* Chỉ hiển thị dấu chấm nếu cả classInCharge và email đều có */}
                      {teacher.classInCharge && teacher.email && (
                        <span className="mx-0">•</span>
                      )}
                      <span className="truncate flex-1">{teacher.email}</span>
                    </div>
                  </div>
                </div>

                <button
                  className="text-sm text-red-600 ml-4 p-2 rounded-full hover:bg-red-50 transition-colors active:scale-90 flex-shrink-0" // Button tròn, hover, click
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteTeacher(teacher.id);
                  }}
                >
                  Delete
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-lg">
              {" "}
              {/* Font lớn hơn cho No teachers */}
              No teachers found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-xl shadow-lg">
          {" "}
          {/* Bo góc và shadow đẹp hơn cho dialog */}
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-800">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This will permanently delete this teacher and remove their data
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

export default TeachersPage;
