// src/api/menuApi.ts
import axiosInstance from "@/api/axiosInstance";
import { Menu } from "@/models/menu"; // Import model Menu

// GET all menus
export const getMenus = async (): Promise<Menu[]> => {
  const response = await axiosInstance.get("/menus/"); // Endpoint cho danh sách menu
  return response.data as Menu[];
};

// GET one menu by ID
export const getMenuById = async (id: number): Promise<Menu> => {
  const response = await axiosInstance.get(`/menus/${id}/`); // Endpoint cho một menu cụ thể
  return response.data as Menu;
};

// CREATE a new menu
export const createMenu = async (
  menuData: Partial<Menu> // Sử dụng Partial<Menu> vì ID thường do backend tạo
): Promise<Menu> => {
  const response = await axiosInstance.post("/menus/", menuData); // Endpoint POST để tạo
  return response.data as Menu;
};

// UPDATE a menu
export const updateMenu = async (
  id: number,
  updatedData: Partial<Menu> // Sử dụng Partial<Menu> cho dữ liệu cập nhật
): Promise<Menu> => {
  const response = await axiosInstance.put(`/menus/${id}/`, updatedData); // Endpoint PUT để cập nhật
  return response.data as Menu;
};

// DELETE a menu
export const deleteMenu = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/menus/${id}/`); // Endpoint DELETE để xóa
};
