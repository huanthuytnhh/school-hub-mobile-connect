import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription, // IMPORT THIS: Add DrawerDescription
} from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import { Student } from "@/models/student"; // Assuming this is the correct path for your Student model

interface TransformedAttendanceRecord {
  date: Date;
  isPresent: boolean;
}

interface StudentAttendanceHistoryProps {
  open: boolean;
  onClose: () => void;
  student: Student | null; // Student model
  month: Date; // A Date object, e.g., current month
  attendanceHistory: TransformedAttendanceRecord[]; // Transformed history with Date objects and camelCase isPresent
  isLoading: boolean; // Add isLoading prop to show loading state
}

const StudentAttendanceHistory: React.FC<StudentAttendanceHistoryProps> = ({
  open,
  onClose,
  student,
  month,
  attendanceHistory,
  isLoading, // Use isLoading prop
}) => {
  // Custom day content for the calendar to show attendance status
  const dayContent = (day: Date) => {
    // Convert date to string format for comparison (e.g., "Mon May 25 2025")
    const dateString = day.toDateString();

    // Find this day in attendance history
    const record = attendanceHistory.find(
      (record) => record.date.toDateString() === dateString
    );

    // If no record for this day, return just the date
    if (!record) return <div>{day.getDate()}</div>;

    // Show colored indicator based on attendance
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
          {/* FIX 2: Add DrawerDescription for accessibility */}
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
              } // Fallback avatar
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
          ) : attendanceHistory.length > 0 ? (
            <Calendar
              mode="single"
              selected={null} // Don't highlight a specific day by default
              month={month}
              className="w-full rounded-md"
              components={{
                // FIX 1: Destructure 'displayMonth' (and potentially other non-DOM props)
                // to prevent them from being spread onto the <div>
                Day: ({ date, displayMonth, ...props }) => (
                  <div {...props}>
                    {" "}
                    {/* 'props' no longer contains 'displayMonth' */}
                    {dayContent(date)}
                  </div>
                ),
              }}
            />
          ) : (
            <p className="text-center text-gray-500 py-4">
              No attendance history found for this month.
            </p>
          )}

          {/* Legend */}
          {!isLoading && attendanceHistory.length > 0 && (
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
