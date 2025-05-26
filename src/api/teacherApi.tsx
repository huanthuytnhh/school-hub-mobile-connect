// GET user role (for teacher)
export const getUserRole = async (email?: string): Promise<string> => {
  const url = email
    ? `/user-role/?email=${encodeURIComponent(email)}`
    : "/user-role/";

  const response = await axiosInstance.get(url);
  console.log("Role response:", response.data);
  return response.data || "undefined";
};
// src/api/teacherApi.ts
import axiosInstance from "@/api/axiosInstance";
import { Teacher } from "@/models/teacher"; // Vẫn import từ model Teacher đã được cập nhật

// GET all teachers
export const getTeachers = async (): Promise<Teacher[]> => {
  const response = await axiosInstance.get("/teachers/");
  return response.data as Teacher[];
};

// GET one teacher by ID
export const getTeacherById = async (id: number): Promise<Teacher> => {
  const response = await axiosInstance.get(`/teachers/${id}/`);
  return response.data as Teacher;
};

// CREATE a new teacher
export const createTeacher = async (
  teacherData: Partial<Teacher> // partial Teacher sẽ tự động chấp nhận các trường mới
): Promise<Teacher> => {
  const response = await axiosInstance.post("/teachers/", teacherData);
  return response.data as Teacher;
};

// UPDATE a teacher
export const updateTeacher = async (
  id: number,
  updatedData: Partial<Teacher> // partial Teacher sẽ tự động chấp nhận các trường mới
): Promise<Teacher> => {
  const response = await axiosInstance.put(`/teachers/${id}/`, updatedData);
  return response.data as Teacher;
};

// DELETE a teacher
export const deleteTeacher = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/teachers/${id}/`);
};
