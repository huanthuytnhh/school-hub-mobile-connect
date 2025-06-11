// src/api/attendanceApi.ts
import axiosInstance from "@/api/axiosInstance";

/**
 * Định nghĩa kiểu dữ liệu cho bản ghi điểm danh nhận từ API hoặc gửi lên.
 * - `id`: (Tùy chọn) ID của bản ghi điểm danh, nếu backend trả về.
 * - `studentId`: ID của học sinh.
 * - `classId`: (Tùy chọn khi nhận) ID của lớp (giá trị từ student.grade), nếu backend trả về.
 * - `date`: Ngày điểm danh (YYYY-MM-DD).
 * - `is_present`: Trạng thái điểm danh (true: có mặt, false: vắng mặt).
 * - `notes`: (Tùy chọn) Ghi chú.
 */
export interface AttendanceRecord {
  id?: number; // ID của bản ghi điểm danh, nếu backend trả về
  studentId: number;
  classId?: string; // Giá trị của student.grade, backend có thể trả về nếu cần
  date: string; // YYYY-MM-DD
  is_present: boolean;
  notes?: string;
}

/**
 * Định nghĩa kiểu dữ liệu cho payload khi gửi yêu cầu ghi nhận điểm danh.
 */
export interface MarkAttendancePayload {
  studentId: number;
  classId: string; // Sẽ là giá trị từ student.grade (ví dụ: "5/1")
  date: string; // YYYY-MM-DD
  isPresent: boolean;
  notes?: string;
}

/**
 * Lấy danh sách điểm danh của một lớp vào một ngày cụ thể.
 * @param classIdentifier Giá trị từ student.grade (ví dụ: "5/1") được dùng làm định danh lớp.
 * @param date Ngày cần lấy điểm danh (định dạng YYYY-MM-DD).
 * @returns Promise<AttendanceRecord[]> Danh sách các bản ghi điểm danh.
 */
export const getAttendanceByClassAndDate = async (
  classIdentifier: string,
  date: string
): Promise<AttendanceRecord[]> => {
  const response = await axiosInstance.get("/attendances/", {
    params: {
      classId: classIdentifier, // Gửi lên server với key là classId
      date: date,
    },
  });
  return response.data as AttendanceRecord[];
};

/**
 * Ghi nhận hoặc cập nhật một bản ghi điểm danh cho một học sinh.
 * Backend sẽ xử lý logic tạo mới hoặc cập nhật (upsert).
 * @param attendanceData Dữ liệu điểm danh cần gửi (classId sẽ là student.grade).
 * @returns Promise<AttendanceRecord> Bản ghi điểm danh đã được tạo/cập nhật.
 */
export const markStudentAttendance = async (
  attendanceData: MarkAttendancePayload
): Promise<AttendanceRecord> => {
  // Chuyển camelCase sang snake_case cho đúng API yêu cầu
  const payload = {
    student_id: attendanceData.studentId,
    class_id: attendanceData.classId,
    date: attendanceData.date,
    is_present: attendanceData.isPresent,
    notes: attendanceData.notes,
  };
  console.log("Marking attendance with payload:", payload);
  const response = await axiosInstance.post("/attendances/", payload);
  return response.data as AttendanceRecord;
};

/**
 * Lấy lịch sử điểm danh của một học sinh trong một tháng/năm cụ thể.
 * @param studentId ID của học sinh.
 * @param month Tháng (1-12).
 * @param year Năm.
 * @returns Promise<AttendanceRecord[]> Lịch sử điểm danh.
 */
export const getStudentAttendanceHistory = async (
  studentId: number,
  month: number,
  year: number
): Promise<AttendanceRecord[]> => {
  const response = await axiosInstance.get("/attendances/", {
    params: {
      studentId: studentId,
      month: month,
      year: year,
      // Có thể backend cần một tham số để phân biệt là lấy lịch sử, ví dụ: view: 'history'
    },
  });
  return response.data as AttendanceRecord[];
};
