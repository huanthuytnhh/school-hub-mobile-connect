import axiosInstance from "@/api/axiosInstance";
import { Student } from "@/models/student";

// GET all students
export const getStudents = async (): Promise<Student[]> => {
  const response = await axiosInstance.get("/students/");
  return response.data as Student[];
};

// GET one student by ID
export const getStudentById = async (id: number): Promise<Student> => {
  const response = await axiosInstance.get(`/students/${id}/`);
  return response.data as Student;
};

// CREATE a new student
export const createStudent = async (
  studentData: Partial<Student>
): Promise<Student> => {
  const response = await axiosInstance.post("/students/", studentData);
  return response.data as Student;
};

// UPDATE a student
export const updateStudent = async (
  id: number,
  updatedData: Partial<Student>
): Promise<Student> => {
  const response = await axiosInstance.put(`/students/${id}/`, updatedData);
  return response.data as Student;
};

// DELETE a student
export const deleteStudent = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/students/${id}/`);
};
