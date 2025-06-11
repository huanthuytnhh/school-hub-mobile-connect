// src/api/announcementsApi.ts
import axiosInstance from "./axiosInstance";
import { Announcement } from "@/models/announcement"; // Import model Announcement

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: "high" | "medium" | "low";
}

/**
 * Lấy tất cả các thông báo.
 * @returns Promise<Announcement[]> Danh sách các thông báo.
 */
export const getAnnouncements = async (): Promise<Announcement[]> => {
  const response = await axiosInstance.get("/announcements/");
  return response.data;
};

/**
 * Lấy một thông báo theo ID.
 * @param id ID của thông báo.
 * @returns Promise<Announcement> Thông báo tìm được.
 */
export const getAnnouncementById = async (
  id: string
): Promise<Announcement> => {
  const response = await axiosInstance.get(`/announcements/${id}/`);
  return response.data;
};

/**
 * Tạo một thông báo mới.
 * @param announcementData Dữ liệu của thông báo cần tạo. Có thể là Partial<Announcement> vì ID thường do backend tạo.
 * @returns Promise<Announcement> Thông báo đã được tạo (bao gồm ID từ backend).
 */
export const createAnnouncement = async (
  announcementData: Partial<Announcement>
): Promise<Announcement> => {
  const response = await axiosInstance.post(
    "/announcements/",
    announcementData
  );
  return response.data as Announcement;
};

/**
 * Cập nhật một thông báo.
 * @param id ID của thông báo cần cập nhật.
 * @param updatedData Dữ liệu cập nhật cho thông báo. Có thể là Partial<Announcement> vì không phải tất cả các trường đều cần cập nhật.
 * @returns Promise<Announcement> Thông báo đã được cập nhật.
 */
export const updateAnnouncement = async (
  id: number,
  updatedData: Partial<Announcement>
): Promise<Announcement> => {
  const response = await axiosInstance.put(
    `/announcements/${id}/`,
    updatedData
  );
  return response.data as Announcement;
};

/**
 * Xóa một thông báo.
 * @param id ID của thông báo cần xóa.
 * @returns Promise<void>
 */
export const deleteAnnouncement = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/announcements/${id}/`);
};
