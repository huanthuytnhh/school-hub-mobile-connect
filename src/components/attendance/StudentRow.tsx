
import React from 'react';
import { Check, X } from 'lucide-react';

export interface Student {
  id: number;
  name: string;
  grade: string;
  rollNumber: string;
  isPresent: boolean;
  avatar: string;
}

interface StudentRowProps {
  student: Student;
  markAttendance: (studentId: number, isPresent: boolean) => void;
}

const StudentRow: React.FC<StudentRowProps> = ({ student, markAttendance }) => {
  return (
    <div className="grid grid-cols-4 items-center px-4 py-2">
      <div className="col-span-2 flex items-center">
        <img 
          src={student.avatar} 
          alt={student.name} 
          className="w-8 h-8 rounded-full mr-2" 
        />
        <span className="text-sm font-medium">{student.name}</span>
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={() => markAttendance(student.id, false)}
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            student.isPresent === false 
              ? 'bg-red-100 text-red-600' 
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          <X size={14} />
        </button>
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={() => markAttendance(student.id, true)}
          className={`w-6 h-6 rounded-full flex items-center justify-center ${
            student.isPresent === true 
              ? 'bg-green-100 text-green-600' 
              : 'bg-gray-100 text-gray-400'
          }`}
        >
          <Check size={14} />
        </button>
      </div>
    </div>
  );
};

export default StudentRow;
