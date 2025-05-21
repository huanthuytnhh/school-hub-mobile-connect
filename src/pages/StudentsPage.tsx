
import React from 'react';
import { ArrowLeft, Search, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import BottomNavBar from '@/components/BottomNavBar';

interface Student {
  id: number;
  name: string;
  grade: string;
  section: string;
  rollNumber: string;
  attendance: number;
}

const StudentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = React.useState('');
  
  // Sample student data
  const students: Student[] = [
    { id: 1, name: "Alex Johnson", grade: "10th", section: "A", rollNumber: "1001", attendance: 92 },
    { id: 2, name: "Emma Wilson", grade: "10th", section: "A", rollNumber: "1002", attendance: 88 },
    { id: 3, name: "Michael Brown", grade: "10th", section: "B", rollNumber: "1003", attendance: 95 },
    { id: 4, name: "Sophia Davis", grade: "11th", section: "A", rollNumber: "1101", attendance: 90 },
    { id: 5, name: "William Taylor", grade: "11th", section: "B", rollNumber: "1102", attendance: 87 },
    { id: 6, name: "Olivia Miller", grade: "12th", section: "A", rollNumber: "1201", attendance: 94 },
  ];

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNumber.includes(searchQuery)
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Students</h1>
        </div>
        
        {/* Search */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            className="pl-10 bg-white/90 text-gray-800 border-0"
            placeholder="Search by name or roll number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Student List */}
      <div className="px-5 mt-5">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Student Directory</h2>
        
        <div className="space-y-3 animate-fade-in">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div 
                key={student.id} 
                className="bg-white p-4 rounded-xl shadow-sm flex items-center"
              >
                <div className="h-10 w-10 rounded-full bg-school-secondary flex items-center justify-center text-white mr-3">
                  <User size={18} />
                </div>
                
                <div className="flex-1">
                  <h3 className="font-medium">{student.name}</h3>
                  <div className="flex text-xs text-gray-500 mt-1">
                    <span className="mr-3">Class: {student.grade} {student.section}</span>
                    <span>Roll: {student.rollNumber}</span>
                  </div>
                </div>
                
                <div className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-800">
                  {student.attendance}%
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              No students found matching "{searchQuery}"
            </div>
          )}
        </div>
      </div>
      
      <BottomNavBar />
    </div>
  );
};

export default StudentsPage;
