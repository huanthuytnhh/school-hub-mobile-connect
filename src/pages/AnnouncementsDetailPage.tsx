// src/pages/AnnouncementsDetailPage.tsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Announcement } from "@/models/announcement"; // Chỉ import Announcement
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
// Import các hàm API cần thiết
import {
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/api/announcementApi";
// announcementApi;

const AnnouncementsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // 'new' hoặc ID số
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Announcement> | null>(null); // Dùng Partial cho formData
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isNew = id === "new";

  useEffect(() => {
    const loadAnnouncementData = async () => {
      setIsLoading(true);
      setError(null);
      if (isNew) {
        // Khởi tạo form cho thông báo mới
        setFormData({
          title: "",
          message: "",
          category: "Reminder",
          date: new Date().toISOString().split("T")[0], // Ngày hiện tại
          time: new Date().toTimeString().split(" ")[0].substring(0, 5), // Giờ hiện tại (HH:MM)
          recipients: [],
        });
        setIsLoading(false);
      } else {
        // Tải dữ liệu thông báo để chỉnh sửa
        try {
          const announcementId = parseInt(id || "", 10);
          if (isNaN(announcementId)) {
            throw new Error("Invalid announcement ID.");
          }
          const data = await getAnnouncementById(announcementId);
          setFormData(data);
        } catch (err) {
          console.error("Failed to load announcement:", err);
          setError("Failed to load announcement data. Please try again.");
          // Có thể điều hướng về trang danh sách nếu thông báo không tìm thấy
          // navigate("/announcements");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadAnnouncementData();
  }, [id, isNew]); // id và isNew là dependency

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleRecipientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormData((prev) =>
      prev
        ? { ...prev, recipients: value.split(",").map((s) => s.trim()) }
        : null
    );
  };

  const handleSave = async () => {
    if (!formData) return;

    // Kiểm tra dữ liệu cần thiết
    if (!formData.title || !formData.message || !formData.category) {
      setError("Title, message, and category are required.");
      return;
    }

    try {
      if (isNew) {
        // Tạo mới thông báo
        // Omit id vì backend sẽ tạo
        await createAnnouncement(formData as Omit<Announcement, "id">);
        // Có thể thêm toast/thông báo thành công
        alert("Announcement created successfully!"); // Thay bằng toast
      } else {
        // Cập nhật thông báo
        const announcementId = parseInt(id || "", 10);
        if (isNaN(announcementId)) throw new Error("Invalid ID for update.");
        await updateAnnouncement(announcementId, formData);
        // Có thể thêm toast/thông báo thành công
        alert("Announcement updated successfully!"); // Thay bằng toast
      }
      navigate("/announcements"); // Quay lại trang danh sách sau khi lưu
    } catch (err) {
      console.error("Error saving announcement:", err);
      setError("Failed to save announcement. Please try again."); // Hiển thị lỗi
      // Có thể thêm toast/thông báo lỗi
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (isNew || !formData?.id) {
      // Không thể xóa nếu đang tạo mới hoặc không có ID
      setIsDeleteDialogOpen(false);
      return;
    }
    try {
      const announcementId = parseInt(id || "", 10);
      if (isNaN(announcementId)) throw new Error("Invalid ID for delete.");

      await deleteAnnouncement(announcementId); // Gọi API xóa
      alert("Announcement deleted successfully!"); // Thay bằng toast
      navigate("/announcements"); // Quay lại trang danh sách sau khi xóa
    } catch (err) {
      console.error("Error deleting announcement:", err);
      setError("Failed to delete announcement. Please try again."); // Hiển thị lỗi
      // Có thể thêm toast/thông báo lỗi
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (isLoading) {
    return <div className="p-5 text-center mt-8">Loading form...</div>;
  }

  if (error && !formData) {
    // Hiển thị lỗi nếu không load được dữ liệu
    return <div className="p-5 text-center mt-8 text-red-500">{error}</div>;
  }

  if (!formData) {
    // Trường hợp không tìm thấy dữ liệu và không phải tạo mới
    return (
      <div className="p-5 text-center mt-8 text-gray-600">
        Announcement not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 flex items-center">
        <Link to="/announcements" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">
          {isNew ? "Add New Announcement" : "Edit Announcement"}
        </h1>
      </div>

      {/* Form */}
      <div className="px-5 mt-6 space-y-4">
        {error && <p className="text-red-500 text-center">{error}</p>}{" "}
        {/* Hiển thị lỗi khi lưu */}
        <div className="space-y-2">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={formData.title || ""}
            onChange={handleInputChange}
            placeholder="Enter title"
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-gray-700"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message || ""}
            onChange={handleInputChange}
            placeholder="Enter message..."
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-school-primary focus:border-school-primary"
            rows={4}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category || "Reminder"}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-school-primary focus:border-school-primary"
          >
            <option value="Reminder">Reminder</option>
            <option value="Update">Update</option>
            <option value="Transaction">Transaction</option>
          </select>
        </div>
        <div className="space-y-2">
          <label
            htmlFor="date"
            className="block text-sm font-medium text-gray-700"
          >
            Date
          </label>
          <Input
            id="date"
            name="date"
            type="date"
            value={formData.date || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="time"
            className="block text-sm font-medium text-gray-700"
          >
            Time
          </label>
          <Input
            id="time"
            name="time"
            type="time"
            value={formData.time || ""}
            onChange={handleInputChange}
          />
        </div>
        <div className="space-y-2">
          <label
            htmlFor="recipients"
            className="block text-sm font-medium text-gray-700"
          >
            Recipients (comma-separated)
          </label>
          <Input
            id="recipients"
            name="recipients"
            value={formData.recipients?.join(", ") || ""}
            onChange={handleRecipientsChange}
            placeholder="Enter recipients (e.g., Parents, Students)"
          />
        </div>
        <div className="flex gap-3 mt-6">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSave}
            disabled={isLoading} // Disable nút khi đang tải hoặc lưu
          >
            <Save className="mr-2 h-4 w-4" />{" "}
            {isNew ? "Create" : "Save Changes"}
          </Button>
          {!isNew && ( // Chỉ hiển thị nút xóa khi đang chỉnh sửa thông báo đã có
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDeleteClick}
              disabled={isLoading}
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the announcement titled "
              {formData?.title}". This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-500 hover:bg-red-600"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnnouncementsDetailPage;
