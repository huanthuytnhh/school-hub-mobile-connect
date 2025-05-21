
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import BottomNavBar from '@/components/BottomNavBar';
import HeaderCalendar from '@/components/attendance/HeaderCalendar';
import SearchBar from '@/components/attendance/SearchBar';
import ClassSelector from '@/components/attendance/ClassSelector';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import { initialStudents } from '@/models/student';

const CheckInPage: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("5/1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Available classes
  const classes = ["5/1", "5/2", "6/1", "6/2"];
  
  // Students data
  const [students, setStudents] = useState(initialStudents);

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
      <HeaderCalendar date={date} setDate={setDate} />
      
      {/* Search and Class Selection */}
      <div className="px-4 mt-4">
        <SearchBar 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
        />
        
        <div className="bg-white rounded-xl shadow-sm p-4 mb-4">
          <h2 className="font-bold mb-1">Boarding</h2>
          <p className="text-sm text-gray-500">{formattedDate} | {dayName}</p>
        </div>
        
        <ClassSelector 
          selectedClass={selectedClass}
          handleClassChange={handleClassChange}
          classes={classes}
        />
      </div>
      
      {/* Attendance List */}
      <div className="px-4">
        <AttendanceTable 
          students={filteredStudents} 
          markAttendance={markAttendance} 
        />
        
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
