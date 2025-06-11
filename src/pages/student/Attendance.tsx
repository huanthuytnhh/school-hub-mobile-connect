import React, { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import {
  getStudentAttendanceHistory,
  markStudentAttendance,
} from "@/api/attendanceApi";
import { getStudentById } from "@/api/studentApi";
import BottomNavBar from "@/components/BottomNavBar";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import StudentAttendanceHistory from "@/components/attendance/StudentAttendanceHistory";

interface Student {
  id: number;
  name: string;
  grade: string;
  avatar?: string;
  rollNumber?: string;
  email?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  gender?: string;
}

interface AttendanceRecord {
  date: string;
  isPresent: boolean;
  notes?: string;
}

const StudentAttendance = () => {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [status, setStatus] = useState<"present" | "absent" | null>(null);
  const [loading, setLoading] = useState(true);
  const [attendanceHistory, setAttendanceHistory] = useState<
    AttendanceRecord[]
  >([]);
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

  const fetchAttendanceHistory = useCallback(
    async (studentId: number) => {
      try {
        const month = selectedDate.getMonth() + 1;
        const year = selectedDate.getFullYear();
        const history = await getStudentAttendanceHistory(
          studentId,
          month,
          year
        );
        setAttendanceHistory(history);
        console.log("Selected date:", selectedDate);
        console.log("Formatted date:", format(selectedDate, "yyyy-MM-dd"));
        console.log("Formatted month:", month);
        console.log("Formatted year:", year);
        console.log("Attendance history:", history);

        // Check attendance status for selected date
        const todayAttendance = history.find(
          (record) => record.date === format(selectedDate, "yyyy-MM-dd")
        );
        console.log("Today's attendance record:", todayAttendance?.is_present);
        setStatus(
          todayAttendance
            ? todayAttendance.is_present
              ? "present"
              : "absent"
            : null
        );
        console.log("Status set to:", status);
      } catch (error) {
        console.error("Failed to fetch attendance history:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải lịch sử điểm danh",
          variant: "destructive",
        });
      }
    },
    [selectedDate, toast]
  );

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const studentId = location.state?.studentId;
        if (studentId) {
          const data = await getStudentById(studentId);
          setStudent(data);
          await fetchAttendanceHistory(data.id);
        }
      } catch (error) {
        console.error("Failed to fetch student:", error);
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin học sinh",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [location.state?.studentId, fetchAttendanceHistory, toast]);

  // useEffect(() => {
  //   if (student) {
  //     const interval = setInterval(async () => {
  //       await fetchAttendanceHistory(student.id);
  //     }, 30000);

  //     return () => clearInterval(interval);
  //   }
  // }, [student, fetchAttendanceHistory]);

  const handleSubmit = async () => {
    if (!student || !status) return;

    try {
      setLoading(true);
      await markStudentAttendance({
        studentId: student.id,
        classId: student.grade,
        date: format(selectedDate, "yyyy-MM-dd"),
        isPresent: status === "present",
      });

      toast({
        title: "Thành công",
        description: "Điểm danh thành công",
      });

      // Chỉ gọi API để lấy dữ liệu mới nhất và cập nhật trạng thái
      await fetchAttendanceHistory(student.id);
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      toast({
        title: "Lỗi",
        description: "Không thể điểm danh",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  if (loading && !student) {
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
          <h1 className="text-xl font-bold text-red-500">Lỗi</h1>
          <p className="text-gray-600">Không tìm thấy thông tin học sinh</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 shadow-md">
        <div className="flex items-center mb-4">
          <button
            onClick={() =>
              navigate("/student-home", { state: { studentId: student.id } })
            }
            className="mr-4 p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Điểm Danh</h1>
        </div>
        <div className="flex items-center gap-4">
          <img
            src={student.avatar}
            alt={student.name}
            className="w-12 h-12 rounded-full border-2 border-white"
          />
          <div>
            <h2 className="text-lg font-semibold">{student.name}</h2>
            <p className="text-sm opacity-90">Lớp: {student.grade}</p>
          </div>
        </div>
      </div>

      <div className="p-5">
        <div className="bg-white rounded-xl p-5 shadow-sm">
          {/* Date Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn Ngày
            </label>
            <input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => setSelectedDate(new Date(e.target.value))}
              className="w-full p-2 border rounded-lg"
            />
          </div>

          {/* Status Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Trạng Thái
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => setStatus("present")}
                variant={status === "present" ? "default" : "outline"}
                className={`h-auto py-4 ${
                  status === "present"
                    ? "bg-green-500 hover:bg-green-600"
                    : "border-green-400 text-green-500 hover:bg-green-50"
                }`}
                disabled={loading}
              >
                <Check className="mr-2 h-5 w-5" />
                <span className="text-lg font-semibold">Có Mặt</span>
              </Button>
              <Button
                onClick={() => setStatus("absent")}
                variant={status === "absent" ? "destructive" : "outline"}
                className={`h-auto py-4 ${
                  status === "absent"
                    ? "bg-red-500 hover:bg-red-600"
                    : "border-red-400 text-red-500 hover:bg-red-50"
                }`}
                disabled={loading}
              >
                <X className="mr-2 h-5 w-5" />
                <span className="text-lg font-semibold">Vắng Mặt</span>
              </Button>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!status || loading}
            className="w-full py-3"
          >
            {loading ? "Đang xử lý..." : "Xác Nhận Điểm Danh"}
          </Button>

          {/* View Attendance History Button */}
          <Button
            onClick={() => setIsHistoryDrawerOpen(true)}
            className="w-full py-3 mt-4"
          >
            Xem Lịch Sử Điểm Danh
          </Button>

          {/* Attendance History Drawer */}
          {isHistoryDrawerOpen && (
            <StudentAttendanceHistory
              open={isHistoryDrawerOpen}
              onClose={() => setIsHistoryDrawerOpen(false)}
              student={student}
              month={selectedDate}
              attendanceHistory={attendanceHistory.map((record) => ({
                date: new Date(record.date),
                isPresent: record.isPresent,
              }))}
              isLoading={loading}
            />
          )}
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default StudentAttendance;
