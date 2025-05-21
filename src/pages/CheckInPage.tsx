
import React, { useState } from 'react';
import { ArrowLeft, Check, X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import BottomNavBar from '@/components/BottomNavBar';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';

interface Student {
  id: number;
  name: string;
  grade: string;
  rollNumber: string;
  isPresent: boolean;
  avatar: string;
}

const CheckInPage: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("5/1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Available classes
  const classes = ["5/1", "5/2", "6/1", "6/2"];
  
  // Sample students data - all preset to present (isPresent: true)
  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: "Luu Duy Quang", grade: "5/1", rollNumber: "1001", isPresent: true, avatar: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "Le Hai Khoa", grade: "5/1", rollNumber: "1002", isPresent: true, avatar: "https://i.pravatar.cc/150?img=2" },
    { id: 3, name: "Le Ngoc Thanh", grade: "5/1", rollNumber: "1003", isPresent: true, avatar: "https://i.pravatar.cc/150?img=3" },
    { id: 4, name: "Ngo Nguyen Tan Quan", grade: "5/1", rollNumber: "1101", isPresent: true, avatar: "https://i.pravatar.cc/150?img=4" },
    // Add students from other classes
    { id: 5, name: "Tran Van A", grade: "5/2", rollNumber: "2001", isPresent: true, avatar: "https://i.pravatar.cc/150?img=5" },
    { id: 6, name: "Nguyen Van B", grade: "5/2", rollNumber: "2002", isPresent: true, avatar: "https://i.pravatar.cc/150?img=6" },
    { id: 7, name: "Pham Thi C", grade: "6/1", rollNumber: "3001", isPresent: true, avatar: "https://i.pravatar.cc/150?img=7" },
    { id: 8, name: "Hoang Van D", grade: "6/2", rollNumber: "4001", isPresent: true, avatar: "https://i.pravatar.cc/150?img=8" },
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

  const handleClassChange = (classValue: string) => {
    setSelectedClass(classValue);
  };

  const submitAttendance = () => {
    toast({
      title: "Attendance Submitted",
      description: `Successfully recorded attendance for ${formattedDate}`,
    });
  };

  // Filter students by search query AND selected class
  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
    student.grade === selectedClass
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
        
        {/* Class Selector - Now functional with dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-school-secondary/20 rounded-xl shadow-sm p-4 mb-4 w-full text-left">
            <h2 className="text-school-primary font-semibold">
              Class {selectedClass}
            </h2>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-full max-w-[90vw] bg-white">
            {classes.map((classItem) => (
              <DropdownMenuItem 
                key={classItem}
                onClick={() => handleClassChange(classItem)}
                className="cursor-pointer"
              >
                Class {classItem}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
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
