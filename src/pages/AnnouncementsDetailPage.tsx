// src/pages/AnnouncementsDetailPage.tsx
import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Trash2, Bell, X } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Announcement } from "@/models/announcement";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import {
  getAnnouncementById,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
} from "@/api/announcementApi";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

const AnnouncementsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<Announcement> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const isNew = id === "new";

  useEffect(() => {
    const loadAnnouncementData = async () => {
      setIsLoading(true);
      setError(null);
      if (isNew) {
        setFormData({
          title: "",
          message: "",
          category: "Reminder",
          date: new Date().toISOString().split("T")[0],
          time: new Date().toTimeString().split(" ")[0].substring(0, 5),
          recipients: ["All"],
        });
        setIsLoading(false);
      } else {
        try {
          const announcementId = parseInt(id || "", 10);
          if (isNaN(announcementId)) {
            throw new Error("Invalid announcement ID.");
          }
          const data = await getAnnouncementById(announcementId);
          setFormData({
            ...data,
            recipients: data.recipients || ["All"],
          });
        } catch (err) {
          console.error("Failed to load announcement:", err);
          setError("Không thể tải thông báo. Vui lòng thử lại.");
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadAnnouncementData();
  }, [id, isNew]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData?.title?.trim()) {
      errors.title = "Tiêu đề là bắt buộc";
    }

    if (!formData?.message?.trim()) {
      errors.message = "Nội dung là bắt buộc";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));

    // Clear error when field is edited
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRecipientsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const recipientsArray = value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s);
    setFormData((prev) =>
      prev ? { ...prev, recipients: recipientsArray } : null
    );
  };

  const handleSave = async () => {
    if (!formData) return;

    if (!validateForm()) return;

    setIsSaving(true);
    setError(null);

    try {
      if (isNew) {
        await createAnnouncement(formData as Omit<Announcement, "id">);
        navigate("/announcements", {
          state: { success: "Thông báo đã được tạo thành công!" },
        });
      } else {
        const announcementId = parseInt(id || "", 10);
        if (isNaN(announcementId)) throw new Error("Invalid ID for update.");
        await updateAnnouncement(announcementId, formData);
        navigate("/announcements", {
          state: { success: "Thông báo đã được cập nhật!" },
        });
      }
    } catch (err) {
      console.error("Error saving announcement:", err);
      setError("Lỗi khi lưu thông báo. Vui lòng thử lại.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (isNew || !formData?.id) {
      setIsDeleteDialogOpen(false);
      return;
    }

    try {
      const announcementId = parseInt(id || "", 10);
      if (isNaN(announcementId)) throw new Error("Invalid ID for delete.");

      await deleteAnnouncement(announcementId);
      navigate("/announcements", {
        state: { success: "Thông báo đã được xóa!" },
      });
    } catch (err) {
      console.error("Error deleting announcement:", err);
      setError("Lỗi khi xóa thông báo. Vui lòng thử lại.");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const formatDateTime = (date: string, time: string) => {
    try {
      const dateObj = new Date(date);
      const formattedDate = format(dateObj, "EEEE, dd/MM/yyyy", { locale: vi });
      return `${formattedDate.charAt(0).toUpperCase()}${formattedDate.slice(
        1
      )} • ${time}`;
    } catch {
      return `${date} • ${time}`;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24">
        <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="px-4 py-3 flex items-center">
            <Link to="/announcements" className="p-1 rounded-lg mr-3">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <Skeleton className="h-6 w-48 rounded-md" />
          </div>
        </div>

        <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="h-4 w-24 rounded-full" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          ))}
          <div className="flex gap-3 mt-8">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error && !formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 w-full max-w-md">
          <div className="text-red-500 text-lg font-medium mb-4">{error}</div>
          <Button
            onClick={() => navigate("/announcements")}
            className="bg-blue-600 text-white rounded-full"
          >
            Quay lại
          </Button>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 text-center border border-gray-100 w-full max-w-md">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bell className="h-8 w-8 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Không tìm thấy thông báo
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Thông báo bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button
            onClick={() => navigate("/announcements")}
            className="bg-blue-600 text-white rounded-full w-full"
          >
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="px-4 py-3 flex items-center">
          <Link
            to="/announcements"
            className="p-1 rounded-lg mr-3 hover:bg-gray-100"
          >
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <h1 className="text-xl font-bold text-gray-900">
            {isNew ? "Tạo thông báo mới" : "Chỉnh sửa thông báo"}
          </h1>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-2xl mx-auto px-4 py-6">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl mb-6 flex items-start">
            <X className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-6">
          <div className="flex items-center mb-6">
            <div className="bg-blue-100 p-2.5 rounded-lg mr-3">
              <Bell className="h-5 w-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Thông tin thông báo
            </h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tiêu đề
              </label>
              <Input
                name="title"
                value={formData.title || ""}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề thông báo"
                className={`rounded-xl ${
                  fieldErrors.title ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.title && (
                <p className="mt-1 text-red-500 text-sm">{fieldErrors.title}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nội dung
              </label>
              <Textarea
                name="message"
                value={formData.message || ""}
                onChange={handleInputChange}
                placeholder="Nhập nội dung thông báo..."
                rows={5}
                className={`rounded-xl ${
                  fieldErrors.message ? "border-red-500" : ""
                }`}
              />
              {fieldErrors.message && (
                <p className="mt-1 text-red-500 text-sm">
                  {fieldErrors.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                name="category"
                value={formData.category || "Reminder"}
                onChange={handleInputChange}
                className="w-full p-3 border border-gray-300 rounded-xl shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="Reminder">Nhắc nhở</option>
                <option value="Update">Cập nhật</option>
                <option value="Transaction">Giao dịch</option>
                <option value="Event">Sự kiện</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ngày
                </label>
                <Input
                  name="date"
                  type="date"
                  value={formData.date || ""}
                  onChange={handleInputChange}
                  className="rounded-xl"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Giờ
                </label>
                <Input
                  name="time"
                  type="time"
                  value={formData.time || ""}
                  onChange={handleInputChange}
                  className="rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đối tượng nhận (cách nhau bằng dấu phẩy)
              </label>
              <Input
                name="recipients"
                value={formData.recipients?.join(", ") || ""}
                onChange={handleRecipientsChange}
                placeholder="Ví dụ: Phụ huynh, Học sinh"
                className="rounded-xl"
              />
              <p className="mt-2 text-xs text-gray-500">
                Hiển thị: {formData.recipients?.join(", ") || "Tất cả"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center mb-4">
            <div className="bg-gray-100 p-2.5 rounded-lg mr-3">
              <Bell className="h-5 w-5 text-gray-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Xem trước thông báo
            </h2>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full">
                {formData.category === "Reminder"
                  ? "Nhắc nhở"
                  : formData.category === "Update"
                  ? "Cập nhật"
                  : "Giao dịch"}
              </span>
              <span className="text-xs text-gray-500">
                {formData.date && formData.time
                  ? formatDateTime(formData.date, formData.time)
                  : "Chưa có ngày giờ"}
              </span>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              {formData.title || "[Tiêu đề thông báo]"}
            </h3>
            <p className="text-sm text-gray-600 whitespace-pre-wrap">
              {formData.message || "[Nội dung thông báo sẽ hiển thị ở đây]"}
            </p>
            <div className="flex items-center text-xs text-gray-500 mt-4 pt-3 border-t border-gray-100">
              <span>
                Đối tượng: {formData.recipients?.join(", ") || "Tất cả"}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mt-8">
          <Button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl py-6 text-base"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang lưu...
              </div>
            ) : (
              <>
                <Save className="mr-2 h-5 w-5" />
                {isNew ? "Tạo thông báo" : "Lưu thay đổi"}
              </>
            )}
          </Button>

          {!isNew && (
            <Button
              className="bg-red-100 hover:bg-red-200 text-red-600 rounded-xl py-6"
              onClick={handleDeleteClick}
              disabled={isSaving}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="max-w-md rounded-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa thông báo "{formData?.title}"? Hành động
              này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-xl">Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700 rounded-xl"
              onClick={confirmDelete}
            >
              Xác nhận xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AnnouncementsDetailPage;
