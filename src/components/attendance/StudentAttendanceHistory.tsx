import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import { Student } from "@/models/student";
import { getStudentAttendanceHistory } from "@/api/attendanceApi";

// Hàm chuẩn hóa ngày tháng để loại bỏ ảnh hưởng của múi giờ
const normalizeDate = (date: Date): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

interface TransformedAttendanceRecord {
  date: Date;
  isPresent: boolean;
}

interface StudentAttendanceHistoryProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  month: Date;
  attendanceHistory: TransformedAttendanceRecord[];
  isLoading: boolean;
}

const StudentAttendanceHistory: React.FC<StudentAttendanceHistoryProps> = ({
  open,
  onClose,
  student,
  month,
  attendanceHistory: initialAttendanceHistory,
  isLoading: initialIsLoading,
}) => {
  const [currentMonth, setCurrentMonth] = useState(month);
  const [attendanceData, setAttendanceData] = useState(
    initialAttendanceHistory.map((record) => ({
      ...record,
      date: normalizeDate(record.date),
    }))
  );
  const [isLoading, setIsLoading] = useState(initialIsLoading);

  // Fetch attendance data when currentMonth or student changes
  useEffect(() => {
    const fetchAttendanceForMonth = async () => {
      if (!student) return;
      setIsLoading(true);
      try {
        const year = currentMonth.getFullYear();
        const monthNumber = currentMonth.getMonth() + 1; // getMonth() returns 0-11
        const history = await getStudentAttendanceHistory(
          student.id,
          monthNumber,
          year
        );
        const transformedHistory = history.map((record) => ({
          date: normalizeDate(new Date(record.date)),
          isPresent: record.is_present,
        }));
        setAttendanceData(transformedHistory);
        console.log("attendanceData : ", transformedHistory);
      } catch (error) {
        console.error("Failed to fetch attendance history:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAttendanceForMonth();
  }, [currentMonth, student]);

  // Custom day content for the calendar to show attendance status
  const dayContent = (day: Date) => {
    const normalizedDay = normalizeDate(day);
    const formatDate = (date: Date) => date.toISOString().split("T")[0];
    const currentDate = formatDate(normalizedDay);
    const record = attendanceData.find((record) => {
      const recordDate = formatDate(record.date);
      return recordDate === currentDate;
    });

    if (!record) return <div>{day.getDate()}</div>;

    return (
      <div className="flex flex-col items-center justify-center h-full w-full">
        <div>{day.getDate()}</div>
        <div
          className={`w-2 h-2 rounded-full mt-1 ${
            record.isPresent ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
      </div>
    );
  };

  if (!student) return null;

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="px-4 pb-6 max-h-[90vh] overflow-y-auto">
        <DrawerHeader className="pt-6">
          <DrawerTitle className="text-center text-xl">
            Attendance History
          </DrawerTitle>
          <DrawerDescription className="text-center text-gray-500">
            Showing monthly attendance for {student.name}.
          </DrawerDescription>
        </DrawerHeader>

        {/* Student info */}
        <div className="bg-school-primary/10 rounded-xl p-4 mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={
                student.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  student.name
                )}&background=random&color=fff&size=128`
              }
              alt={student.name}
              className="w-16 h-16 rounded-full border-4 border-white object-cover"
            />
            <div>
              <h3 className="font-bold text-lg">{student.name}</h3>
              <p className="text-gray-500">Class: {student.grade}</p>
              <p className="text-gray-500">ID: {student.rollNumber}</p>
            </div>
          </div>
        </div>

        {/* Calendar with attendance history */}
        <div className="bg-white rounded-xl p-4">
          <h4 className="font-medium mb-2">Monthly Attendance</h4>
          {isLoading ? (
            <p className="text-center text-gray-500 py-8">
              Loading attendance history...
            </p>
          ) : attendanceData.length >= 0 ? (
            <Calendar
              mode="single"
              selected={null}
              month={currentMonth}
              onMonthChange={(newMonth) => {
                setCurrentMonth(normalizeDate(newMonth));
              }}
              className="w-full rounded-md"
              components={{
                Day: ({ date, displayMonth, ...props }) => (
                  <div {...props}>{dayContent(date)}</div>
                ),
              }}
            />
          ) : (
            <p className="text-center text-gray-500 py-4">
              No attendance history found for this month.
            </p>
          )}

          {/* Legend */}
          {!isLoading && attendanceData.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm text-gray-500">Present</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm text-gray-500">Absent</span>
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default StudentAttendanceHistory;
