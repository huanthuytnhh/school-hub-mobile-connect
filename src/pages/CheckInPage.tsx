
import React from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import BottomNavBar from '@/components/BottomNavBar';

interface Student {
  id: number;
  name: string;
  grade: string;
  rollNumber: string;
  isPresent: boolean | null;
}

const CheckInPage: React.FC = () => {
  const { toast } = useToast();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Sample students data
  const [students, setStudents] = React.useState<Student[]>([
    { id: 1, name: "Alex Johnson", grade: "10A", rollNumber: "1001", isPresent: null },
    { id: 2, name: "Emma Wilson", grade: "10A", rollNumber: "1002", isPresent: null },
    { id: 3, name: "Michael Brown", grade: "10B", rollNumber: "1003", isPresent: null },
    { id: 4, name: "Sophia Davis", grade: "11A", rollNumber: "1101", isPresent: null },
    { id: 5, name: "William Taylor", grade: "11B", rollNumber: "1102", isPresent: null },
    { id: 6, name: "Olivia Miller", grade: "12A", rollNumber: "1201", isPresent: null },
  ]);

  const markAttendance = (studentId: number, isPresent: boolean) => {
    setStudents(prevStudents => 
      prevStudents.map(student => 
        student.id === studentId ? { ...student, isPresent } : student
      )
    );
  };

  const submitAttendance = () => {
    const allMarked = students.every(student => student.isPresent !== null);
    
    if (!allMarked) {
      toast({
        title: "Incomplete Attendance",
        description: "Please mark all students as present or absent.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Attendance Submitted",
      description: `Successfully recorded attendance for ${currentDate}`,
    });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Daily Attendance</h1>
        </div>
        <p className="text-sm opacity-90 mt-1">{currentDate}</p>
      </div>
      
      {/* Attendance List */}
      <div className="px-5 mt-5">
        <h2 className="text-lg font-bold mb-4 text-gray-700">Mark Attendance</h2>
        
        <div className="space-y-3 animate-fade-in">
          {students.map((student) => (
            <div 
              key={student.id} 
              className="bg-white p-4 rounded-xl shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">{student.name}</h3>
                  <div className="text-xs text-gray-500 mt-1">
                    Class: {student.grade} | Roll: {student.rollNumber}
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <button 
                    onClick={() => markAttendance(student.id, true)}
                    className={`p-2 rounded-full ${
                      student.isPresent === true 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <CheckCircle size={20} />
                  </button>
                  
                  <button 
                    onClick={() => markAttendance(student.id, false)}
                    className={`p-2 rounded-full ${
                      student.isPresent === false 
                        ? 'bg-red-100 text-red-600' 
                        : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    <XCircle size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <button 
          onClick={submitAttendance}
          className="w-full mt-6 bg-school-primary text-white py-3 rounded-xl font-medium shadow-sm hover:bg-opacity-90 transition-colors"
        >
          Submit Attendance
        </button>
      </div>
      
      <BottomNavBar />
    </div>
  );
};

export default CheckInPage;
