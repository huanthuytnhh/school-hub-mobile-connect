
import React from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Calendar } from "@/components/ui/calendar";
import { Student } from './StudentRow';

interface StudentAttendanceHistoryProps {
  open: boolean;
  onClose: () => void;
  student: Student | null;
  month: Date;
  attendanceHistory: {
    date: Date;
    isPresent: boolean;
  }[];
}

const StudentAttendanceHistory: React.FC<StudentAttendanceHistoryProps> = ({
  open,
  onClose,
  student,
  month,
  attendanceHistory
}) => {
  // Custom day content for the calendar to show attendance status
  const dayContent = (day: Date) => {
    // Convert date to string format for comparison
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
            record.isPresent ? 'bg-green-500' : 'bg-red-500'
          }`}
        ></div>
      </div>
    );
  };

  if (!student) return null;

  return (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent className="px-4 pb-6">
        <DrawerHeader className="pt-6">
          <DrawerTitle className="text-center text-xl">
            Attendance History
          </DrawerTitle>
        </DrawerHeader>

        {/* Student info */}
        <div className="bg-school-primary/10 rounded-xl p-4 mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={student.avatar}
              alt={student.name}
              className="w-16 h-16 rounded-full border-4 border-white"
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
          <Calendar
            mode="single"
            selected={new Date()}
            month={month}
            className="w-full rounded-md"
            components={{
              Day: ({ date, ...props }) => (
                <div {...props}>
                  {dayContent(date)}
                </div>
              )
            }}
          />
          
          {/* Legend */}
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
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default StudentAttendanceHistory;
