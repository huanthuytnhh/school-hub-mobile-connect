import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  priority: "high" | "medium" | "low";
}

const StudentAnnouncements = () => {
  const { toast } = useToast();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      // TODO: Implement announcements fetching
      // Mock data for now
      setAnnouncements([
        {
          id: "1",
          title: "Thông báo nghỉ học",
          content: "Trường sẽ nghỉ học vào ngày mai do bão",
          date: "2024-03-20",
          author: "Ban Giám Hiệu",
          priority: "high",
        },
        {
          id: "2",
          title: "Lịch thi học kỳ",
          content: "Lịch thi học kỳ sẽ được công bố vào tuần sau",
          date: "2024-03-19",
          author: "Phòng Đào Tạo",
          priority: "medium",
        },
      ]);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải thông báo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-school-light p-5">
      <div className="bg-white rounded-xl p-5 shadow-sm">
        <h1 className="text-xl font-bold mb-4">Thông báo</h1>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-school-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải thông báo...</p>
          </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-gray-800">
                    {announcement.title}
                  </h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                      announcement.priority
                    )}`}
                  >
                    {announcement.priority === "high"
                      ? "Quan trọng"
                      : announcement.priority === "medium"
                      ? "Bình thường"
                      : "Thông thường"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">
                  {announcement.content}
                </p>
                <div className="flex justify-between items-center text-xs text-gray-500">
                  <span>{announcement.author}</span>
                  <span>
                    {format(new Date(announcement.date), "dd/MM/yyyy", {
                      locale: vi,
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Không có thông báo nào
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncements;
