
import React, { useState } from 'react';
import { ArrowLeft, Check, X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import BottomNavBar from '@/components/BottomNavBar';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

interface Student {
  id: number;
  name: string;
  grade: string;
  rollNumber: string;
  isPresent: boolean | null;
  avatar: string;
}

const CheckInPage: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("5/1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Sample students data
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Luu Duy Quang", grade: "5/1", rollNumber: "1001", isPresent: null, avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Le Hai Khoa", grade: "5/1", rollNumber: "1002", isPresent: null, avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Le Ngoc Thanh", grade: "5/1", rollNumber: "1003", isPresent: null, avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Ngo Nguyen Tan Quan", grade: "5/1", rollNumber: "1101", isPresent: null, avatar: "https://i.pravatar.cc/150?img=4" },
  ]);

  const formattedDate = date.toLocaleDateString('en-US', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
  
  const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  
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
      description: `Successfully recorded attendance for ${formattedDate}`,
    });
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-school-light pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-4">
        <div className="flex items-center mb-3">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Select Date</h1>
          <div className="ml-auto">
            <span className="text-sm">March 2025</span>
          </div>
        </div>
        
        {/* Calendar View - Simplified weekday selector */}
        <div className="py-2">
          <div className="flex justify-between text-xs mb-2">
            <span>MO</span>
            <span>TU</span>
            <span>WE</span>
            <span>TH</span>
            <span>FR</span>
            <span>SA</span>
            <span>SU</span>
          </div>
          <div className="flex justify-between">
            {[18, 19, 20, 21, 22, 23, 24].map((day) => (
              <button 
                key={day}
                onClick={() => setDate(new Date(2025, 2, day))}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  date.getDate() === day ? 'bg-white text-school-primary' : 'bg-transparent'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Search and Class Selection */}
      <div className="px-4 mt-4">
        <div className="relative bg-white rounded-xl shadow-sm mb-4">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            className="pl-10 py-2 border-0"
            placeholder="Enter Name Or ID"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="font-bold mb-1">Boarding</h2>
          <p className="text-sm text-gray-500">{formattedDate} | {dayName}</p>
        </div>
        
        <div className="bg-school-secondary/20 rounded-xl shadow-sm p-4 mb-4">
          <h2 className="text-school-primary font-semibold">
            Class {selectedClass}
          </h2>
        </div>
      </div>
      
      {/* Attendance List */}
      <div className="px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-4 px-4 py-3 border-b border-gray-100">
            <div className="col-span-2 font-medium">Name</div>
            <div className="text-center font-medium text-gray-500">Absent</div>
            <div className="text-center font-medium text-gray-500">Present</div>
          </div>
          
          <div className="divide-y divide-gray-100">
            {filteredStudents.map((student) => (
              <div 
                key={student.id} 
                className="grid grid-cols-4 items-center px-4 py-2"
              >
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
            ))}
          </div>
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
