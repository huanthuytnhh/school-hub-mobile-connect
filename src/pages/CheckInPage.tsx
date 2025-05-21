
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import BottomNavBar from '@/components/BottomNavBar';
import HeaderCalendar from '@/components/attendance/HeaderCalendar';
import SearchBar from '@/components/attendance/SearchBar';
import ClassSelector from '@/components/attendance/ClassSelector';
import AttendanceTable from '@/components/attendance/AttendanceTable';
import StudentAttendanceHistory from '@/components/attendance/StudentAttendanceHistory';
import { initialStudents } from '@/models/student';
import { Student } from '@/components/attendance/StudentRow';

const CheckInPage: React.FC = () => {
  const { toast } = useToast();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedClass, setSelectedClass] = useState<string>("5/1");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Available classes
  const classes = ["5/1", "5/2", "6/1", "6/2"];
  
  // Students data
  const [students, setStudents] = useState(initialStudents);

  // State for student drawer
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Mock attendance history data (in a real app, this would come from an API or database)
  const [attendanceHistory, setAttendanceHistory] = useState<{
    studentId: number;
    date: Date;
    isPresent: boolean;
  }[]>([
    // Sample data for the current month
    { studentId: 1, date: new Date(2025, 4, 1), isPresent: true },
    { studentId: 1, date: new Date(2025, 4, 2), isPresent: true },
    { studentId: 1, date: new Date(2025, 4, 3), isPresent: false },
    { studentId: 1, date: new Date(2025, 4, 4), isPresent: true },
    { studentId: 1, date: new Date(2025, 4, 5), isPresent: true },
    { studentId: 1, date: new Date(2025, 4, 8), isPresent: false },
    { studentId: 1, date: new Date(2025, 4, 9), isPresent: true },
    { studentId: 1, date: new Date(2025, 4, 10), isPresent: true },
    { studentId: 1, date: new Date(2025, 4, 11), isPresent: true },
    { studentId: 1, date: new Date(2025, 4, 12), isPresent: false },
    
    { studentId: 2, date: new Date(2025, 4, 1), isPresent: true },
    { studentId: 2, date: new Date(2025, 4, 2), isPresent: false },
    { studentId: 2, date: new Date(2025, 4, 3), isPresent: true },
    { studentId: 2, date: new Date(2025, 4, 4), isPresent: true },
    { studentId: 2, date: new Date(2025, 4, 5), isPresent: true },
    { studentId: 2, date: new Date(2025, 4, 8), isPresent: true },
    { studentId: 2, date: new Date(2025, 4, 9), isPresent: false },
    
    // Add more mock data for other students...
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
    
    // Also update today's attendance in the history
    setAttendanceHistory(prev => {
      // Remove any existing record for this student and today's date
      const filtered = prev.filter(
        record => !(record.studentId === studentId && 
                  record.date.toDateString() === date.toDateString())
      );
      
      // Add the new record
      return [...filtered, { studentId, date: new Date(date), isPresent }];
    });
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

  const handleStudentClick = (student: Student) => {
    setSelectedStudent(student);
    setDrawerOpen(true);
  };

  // Filter attendance history for the selected student
  const filteredHistory = selectedStudent ? 
    attendanceHistory.filter(record => record.studentId === selectedStudent.id) : [];

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
          onStudentClick={handleStudentClick}
        />
        
        <button 
          onClick={submitAttendance}
          className="w-full mt-6 bg-school-primary text-white py-3 rounded-xl font-medium shadow-sm hover:bg-opacity-90 transition-colors"
        >
          Submit Attendance
        </button>
      </div>
      
      {/* Student Attendance History Drawer */}
      <StudentAttendanceHistory
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        student={selectedStudent}
        month={date}
        attendanceHistory={filteredHistory}
      />
      
      <BottomNavBar />
    </div>
  );
};

export default CheckInPage;
