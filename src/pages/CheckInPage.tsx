import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ArrowLeft,
  User,
  Check,
  X as IconX,
  CalendarDays,
  ChevronDown,
  Info,
  Edit2,
  MoreVertical, // Thêm icon này
} from "lucide-react";
import { Link } from "react-router-dom";
import { Student } from "@/models/student";
import { getStudents } from "@/api/studentApi";
import {
  getAttendanceByClassAndDate,
  markStudentAttendance,
  getStudentAttendanceHistory,
  AttendanceRecord,
  MarkAttendancePayload,
} from "@/api/attendanceApi";
import BottomNavBar from "@/components/BottomNavBar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import StudentAttendanceHistory from "@/components/attendance/StudentAttendanceHistory";

// Helper function to format date to YYYY-MM-DD string using local date components
const getFormattedDateForAPI = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed, so add 1
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

interface StudentWithAttendance extends Student {
  isPresent: boolean;
  notes?: string;
}

const CheckInPage: React.FC = () => {
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [studentsToDisplay, setStudentsToDisplay] = useState<
    StudentWithAttendance[]
  >([]);
  const [availableGrades, setAvailableGrades] = useState<string[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] =
    useState<StudentWithAttendance | null>(null);
  const [studentHistoryData, setStudentHistoryData] = useState<
    AttendanceRecord[]
  >([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const [isNotesDialogOpen, setIsNotesDialogOpen] = useState(false);
  const [studentForNotes, setStudentForNotes] =
    useState<StudentWithAttendance | null>(null);
  const [currentNotes, setCurrentNotes] = useState<string>("");

  const fetchInitialData = useCallback(async () => {
    setPageError(null);
    try {
      const fetchedStudents = await getStudents();
      console.log("API Response - getStudents:", fetchedStudents);
      setAllStudents(fetchedStudents);

      const uniqueGradesList = Array.from(
        new Set(fetchedStudents.map((s) => s.grade))
      ).sort();
      setAvailableGrades(uniqueGradesList);

      if (uniqueGradesList.length > 0 && !selectedGrade) {
        setSelectedGrade(uniqueGradesList[0]);
      } else if (uniqueGradesList.length === 0) {
        setPageError(
          "No students found to display. Please add students first."
        );
      }
    } catch (err) {
      console.error("Failed to fetch initial data:", err);
      setPageError(
        err instanceof Error ? err.message : "Failed to load initial data"
      );
      setAllStudents([]);
      setAvailableGrades([]);
    } finally {
      setLoading(false); // Ensure loading is false even on error
    }
  }, [selectedGrade]); // Thêm selectedGrade vào dependencies để re-run khi grade thay đổi lần đầu

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    const processStudentAndAttendanceData = async () => {
      if (!selectedGrade || allStudents.length === 0) {
        setStudentsToDisplay([]);
        // This condition is for initial load if selectedGrade is not set yet but students are loaded.
        // It's already handled by fetchInitialData potentially setting selectedGrade.
        // If allStudents is empty and selectedGrade is null, it means no students loaded.
        if (
          allStudents.length > 0 &&
          !selectedGrade &&
          availableGrades.length > 0
        ) {
          setSelectedGrade(availableGrades[0]);
        }
        setLoading(false);
        return;
      }

      setLoading(true);
      setPageError(null);

      const studentsInSelectedGrade = allStudents.filter(
        (student) => student.grade === selectedGrade
      );

      let studentsWithInitialAttendance: StudentWithAttendance[] =
        studentsInSelectedGrade.map((s) => ({
          ...s,
          isPresent: false, // Default to false (Absent)
          notes: "",
        }));

      try {
        const formattedDate = getFormattedDateForAPI(currentDate);
        console.log(
          `Fetching attendance for classId: ${selectedGrade}, date: ${formattedDate}`
        );
        const attendanceRecords = await getAttendanceByClassAndDate(
          selectedGrade,
          formattedDate
        );
        console.log(
          `API Response - getAttendanceByClassAndDate (Class: ${selectedGrade}, Date: ${formattedDate}):`,
          attendanceRecords
        );

        studentsWithInitialAttendance = studentsWithInitialAttendance.map(
          (student) => {
            const record = attendanceRecords.find(
              (r) => r.studentId === student.id
            );
            return {
              ...student,
              isPresent: record ? record.isPresent : false, // Use record.isPresent, default to false
              notes: record ? record.notes || "" : "",
            };
          }
        );
      } catch (err) {
        console.warn(
          `Failed to fetch attendance for ${selectedGrade} on ${currentDate.toLocaleDateString()}:`,
          err
        );
        setPageError(
          "Could not load attendance data for this class and date. Please try again."
        );
      } finally {
        setStudentsToDisplay(studentsWithInitialAttendance);
        setLoading(false);
      }
    };

    // Only run if allStudents is populated or if loading finished with an error indicating no students.
    // Avoid running if allStudents is empty but fetchInitialData is still running.
    if (
      allStudents.length > 0 ||
      (!loading && pageError && allStudents.length === 0)
    ) {
      processStudentAndAttendanceData();
    }
  }, [
    selectedGrade,
    currentDate,
    allStudents,
    availableGrades,
    loading,
    pageError,
  ]); // Thêm loading và pageError vào dependencies

  const handleMarkAttendance = async (
    studentId: number,
    isPresentStatus: boolean,
    notesToSave?: string
  ) => {
    if (!selectedGrade) {
      alert("Please select a grade first.");
      return;
    }

    const studentBeingMarked = studentsToDisplay.find(
      (s) => s.id === studentId
    );
    if (!studentBeingMarked) return;

    const payload: MarkAttendancePayload = {
      studentId,
      classId: selectedGrade,
      date: getFormattedDateForAPI(currentDate),
      isPresent: isPresentStatus,
      notes: notesToSave !== undefined ? notesToSave : studentBeingMarked.notes,
    };

    const previousState = [...studentsToDisplay];

    // Optimistic UI update: Update immediately for responsiveness
    setStudentsToDisplay((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? { ...student, isPresent: isPresentStatus, notes: payload.notes }
          : student
      )
    );

    try {
      const updatedRecord = await markStudentAttendance(payload);
      console.log(
        `API Response - markStudentAttendance (Payload: ${JSON.stringify(
          payload
        )}):`,
        updatedRecord
      );
      // Ensure UI is updated with the actual response from the backend
      setStudentsToDisplay((prevStudents) =>
        prevStudents.map((student) =>
          student.id === studentId
            ? {
                ...student,
                isPresent: updatedRecord.isPresent,
                notes: updatedRecord.notes || "",
              }
            : student
        )
      );
    } catch (err) {
      console.error("Failed to mark attendance:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Failed to mark attendance. Please try again."
      );
      setStudentsToDisplay(previousState); // Rollback on error
    }
  };

  const handleViewHistory = async (student: StudentWithAttendance) => {
    setSelectedStudentForHistory(student);
    setIsHistoryDrawerOpen(true);
    setLoadingHistory(true);
    try {
      const month = currentDate.getMonth() + 1;
      const year = currentDate.getFullYear();
      const history = await getStudentAttendanceHistory(
        student.id,
        month,
        year
      );
      console.log(
        `API Response - getStudentAttendanceHistory (Student ID: ${student.id}, Month: ${month}, Year: ${year}):`,
        history
      );
      setStudentHistoryData(history); // Raw history data from API
    } catch (err) {
      console.error("Failed to fetch student attendance history:", err);
      setPageError(
        err instanceof Error ? err.message : "Failed to load history."
      );
      setStudentHistoryData([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const openNotesDialog = (student: StudentWithAttendance) => {
    setStudentForNotes(student);
    setCurrentNotes(student.notes || "");
    setIsNotesDialogOpen(true);
  };

  const handleSaveNotes = () => {
    if (!studentForNotes) return;

    const currentIsPresent = studentForNotes.isPresent;

    handleMarkAttendance(studentForNotes.id, currentIsPresent, currentNotes);
    setIsNotesDialogOpen(false);
    setStudentForNotes(null);
  };

  const formattedCurrentDateForInput = useMemo(() => {
    const tzOffset = currentDate.getTimezoneOffset() * 60000;
    const localISOTime = new Date(currentDate.getTime() - tzOffset)
      .toISOString()
      .split("T")[0];
    return localISOTime;
  }, [currentDate]);

  const transformedAttendanceHistory = useMemo(() => {
    return studentHistoryData.map((record) => ({
      date: new Date(record.date + "T00:00:00"),
      isPresent: record.isPresent,
    }));
  }, [studentHistoryData]);

  if (loading && allStudents.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-700 text-lg">
        <svg
          className="animate-spin h-8 w-8 mr-3 text-school-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading initial data...
      </div>
    );
  }

  if (pageError && allStudents.length === 0) {
    return (
      <div className="p-5 text-center text-red-500 text-lg">
        Error: {pageError}
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 pb-20">
      <div className="bg-school-primary text-white p-4 shadow-md sticky top-0 z-20">
        <div className="flex items-center">
          <Link to="/" className="mr-4 transition-transform active:scale-95">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Student Attendance</h1>
        </div>
      </div>

      <div className="p-4 bg-white shadow-sm sticky top-[72px] z-10">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <label
              htmlFor="gradeSelector"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Grade
            </label>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto justify-between text-gray-700 border-gray-300 hover:border-school-primary"
                >
                  {selectedGrade || "Select Grade"}{" "}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full sm:w-[200px] max-h-60 overflow-y-auto">
                {availableGrades.length > 0 ? (
                  availableGrades.map((grade) => (
                    <DropdownMenuItem
                      key={grade}
                      onSelect={() => setSelectedGrade(grade)}
                      className="cursor-pointer"
                    >
                      {grade}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    No grades available
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex-1">
            <label
              htmlFor="datePicker"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Select Date
            </label>
            <div className="relative">
              <input
                type="date"
                id="datePicker"
                value={formattedCurrentDateForInput}
                onChange={(e) => {
                  const newDate = new Date(e.target.value + "T00:00:00");
                  if (!isNaN(newDate.getTime())) {
                    setCurrentDate(newDate);
                  }
                }}
                className="w-full sm:w-auto p-2 border border-gray-300 rounded-md shadow-sm focus:ring-school-primary focus:border-school-primary text-gray-700"
              />
              <CalendarDays className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>
        {pageError && (
          <p className="text-sm text-red-500 mt-2 text-center">{pageError}</p>
        )}
      </div>

      {/* HIỂN THỊ DẠNG BẢNG (CHO MÀN HÌNH LỚN HƠN HOẶC BẰNG 'sm') */}
      <div className="flex-grow p-4 overflow-x-auto hidden sm:block">
        {loading && allStudents.length > 0 && (
          <p className="text-center text-gray-600 py-8">
            Loading attendance for {selectedGrade}...
          </p>
        )}
        {!loading &&
          studentsToDisplay.length === 0 &&
          selectedGrade &&
          !pageError && (
            <p className="text-center text-gray-600 mt-8 text-lg">
              No students in grade {selectedGrade}.
            </p>
          )}
        {!loading && studentsToDisplay.length > 0 && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avatar
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">
                    ID
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentsToDisplay.map((student) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 py-2 whitespace-nowrap">
                      <img
                        src={
                          student.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            student.name
                          )}&background=random&color=fff&size=128`
                        }
                        alt={student.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                      {student.rollNumber}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm">
                      {student.isPresent === true ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Present
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                          Absent
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-center text-sm">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:bg-gray-100"
                          >
                            <MoreVertical size={16} />
                            <span className="sr-only">More actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onSelect={() =>
                              handleMarkAttendance(student.id, true)
                            }
                            disabled={student.isPresent === true}
                            className="cursor-pointer flex items-center gap-2 text-green-700"
                          >
                            <Check size={16} /> Mark Present
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() =>
                              handleMarkAttendance(student.id, false)
                            }
                            disabled={student.isPresent === false}
                            className="cursor-pointer flex items-center gap-2 text-red-700"
                          >
                            <IconX size={16} /> Mark Absent
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => openNotesDialog(student)}
                            className="cursor-pointer flex items-center gap-2 text-blue-700"
                          >
                            <Edit2 size={16} /> Add/Edit Note
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => handleViewHistory(student)}
                            className="cursor-pointer flex items-center gap-2 text-purple-700"
                          >
                            <Info size={16} /> View History
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* HIỂN THỊ DẠNG CARD (CHỈ CHO MÀN HÌNH NHỎ HƠN 'sm') */}
      <div className="flex-grow p-4 sm:hidden">
        {loading && allStudents.length > 0 && (
          <p className="text-center text-gray-600 py-8">
            Loading attendance for {selectedGrade}...
          </p>
        )}
        {!loading &&
          studentsToDisplay.length === 0 &&
          selectedGrade &&
          !pageError && (
            <p className="text-center text-gray-600 mt-8 text-lg">
              No students in grade {selectedGrade}.
            </p>
          )}
        {!loading && studentsToDisplay.length > 0 && (
          <div className="space-y-4">
            {" "}
            {/* Tạo khoảng cách giữa các card */}
            {studentsToDisplay.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-lg shadow-md p-4 flex flex-col gap-3"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={
                      student.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        student.name
                      )}&background=random&color=fff&size=128`
                    }
                    alt={student.name}
                    className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-gray-900 truncate">
                      {student.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      ID: {student.rollNumber}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {student.isPresent === true ? (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Present
                      </span>
                    ) : (
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Absent
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-around items-center pt-2 border-t border-gray-100">
                  <Button
                    size="sm"
                    variant={student.isPresent === true ? "default" : "outline"}
                    onClick={() => handleMarkAttendance(student.id, true)}
                    className={`rounded-full px-3 py-1 flex items-center gap-1 transition-all text-sm ${
                      student.isPresent === true
                        ? "bg-green-500 hover:bg-green-600 text-white"
                        : "border-green-400 text-green-500 hover:bg-green-50 hover:border-green-500"
                    }`}
                    disabled={student.isPresent === true}
                  >
                    <Check size={16} /> Present
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      student.isPresent === false ? "destructive" : "outline"
                    }
                    onClick={() => handleMarkAttendance(student.id, false)}
                    className={`rounded-full px-3 py-1 flex items-center gap-1 transition-all text-sm ${
                      student.isPresent === false
                        ? "bg-red-500 hover:bg-red-600 text-white"
                        : "border-red-400 text-red-500 hover:bg-red-50 hover:border-red-500"
                    }`}
                    disabled={student.isPresent === false}
                  >
                    <IconX size={16} /> Absent
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-500 hover:bg-gray-100"
                      >
                        <MoreVertical size={16} />{" "}
                        <span className="hidden sm:inline">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() => openNotesDialog(student)}
                        className="cursor-pointer flex items-center gap-2 text-blue-700"
                      >
                        <Edit2 size={16} /> Edit Note
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() => handleViewHistory(student)}
                        className="cursor-pointer flex items-center gap-2 text-purple-700"
                      >
                        <Info size={16} /> View History
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isNotesDialogOpen} onOpenChange={setIsNotesDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add/Edit Note for {studentForNotes?.name}</DialogTitle>
            <DialogDescription>
              Enter any relevant notes for this student's attendance on{" "}
              {currentDate.toLocaleDateString()}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Attendance notes..."
              value={currentNotes}
              onChange={(e) => setCurrentNotes(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="button" onClick={handleSaveNotes}>
              Save Notes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <StudentAttendanceHistory
        open={isHistoryDrawerOpen}
        onClose={() => {
          setIsHistoryDrawerOpen(false);
          setSelectedStudentForHistory(null);
          setStudentHistoryData([]);
        }}
        student={selectedStudentForHistory}
        month={currentDate}
        attendanceHistory={transformedAttendanceHistory}
        isLoading={loadingHistory}
      />

      <BottomNavBar />
    </div>
  );
};

export default CheckInPage;
