
import React from 'react';
import StudentRow, { Student } from './StudentRow';

interface AttendanceTableProps {
  students: Student[];
  markAttendance: (studentId: number, isPresent: boolean) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ students, markAttendance }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="grid grid-cols-4 px-4 py-3 border-b border-gray-100">
        <div className="col-span-2 font-medium">Name</div>
        <div className="text-center font-medium text-gray-500">Absent</div>
        <div className="text-center font-medium text-gray-500">Present</div>
      </div>
      
      <div className="divide-y divide-gray-100">
        {students.map((student) => (
          <StudentRow 
            key={student.id}
            student={student}
            markAttendance={markAttendance}
          />
        ))}
      </div>
    </div>
  );
};

export default AttendanceTable;
