import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getAnnouncements, Announcement } from "@/api/announcementApi";
import { Bell, Clock, User, ChevronRight, X, ChevronLeft } from "lucide-react";
import BottomNavBar from "@/components/BottomNavBar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const StudentAnnouncements = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error("Failed to fetch announcements:", error);
        setError("Không thể tải thông báo");
        toast({
          title: "Lỗi",
          description: "Không thể tải thông báo",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAnnouncementClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5); // Lấy HH:mm từ HH:mm:ss
  };

  // Skeleton loader
  const renderSkeletons = () => (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-2xl p-4 border border-gray-100"
        >
          <div className="flex items-center justify-between mb-3">
            <Skeleton className="h-5 w-32 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="h-6 w-4/5 mb-2 rounded" />
          <Skeleton className="h-4 w-full mb-3 rounded" />
          <Skeleton className="h-4 w-3/4 rounded" />
          <div className="flex justify-between mt-4 pt-3 border-t border-gray-100">
            <Skeleton className="h-3 w-24 rounded-full" />
            <Skeleton className="h-3 w-16 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Sticky Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-6 w-6 text-gray-600" />
            </button>
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <Bell className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Thông báo</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  Cập nhật mới nhất từ nhà trường
                </p>
              </div>
            </div>
            <div className="text-xs font-medium bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full ml-auto">
              {announcements.length} thông báo
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        {loading ? (
          renderSkeletons()
        ) : error ? (
          <div className="bg-white rounded-2xl p-6 text-center border border-gray-100">
            <div className="text-red-500 text-lg font-medium">{error}</div>
            <button
              onClick={() => {
                setLoading(true);
                setError(null);
                fetchData();
              }}
              className="mt-4 px-4 py-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Thử lại
            </button>
          </div>
        ) : announcements.length > 0 ? (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                onClick={() => handleAnnouncementClick(announcement)}
                className="bg-white rounded-2xl p-4 border border-gray-100 active:scale-[0.98] transition-transform cursor-pointer hover:border-blue-200 hover:shadow-sm"
              >
                <div className="flex items-start">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500">
                        {format(new Date(announcement.date), "dd/MM/yyyy", {
                          locale: vi,
                        })}
                      </span>
                    </div>

                    <h3 className="text-base font-semibold text-gray-900 mb-1.5 line-clamp-2">
                      {announcement.title}
                    </h3>

                    <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                      {announcement.message}
                    </p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                        <User className="h-3.5 w-3.5" />
                        <span>Nhà trường</span>
                      </div>
                      <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{formatTime(announcement.time)}</span>
                      </div>
                    </div>
                  </div>

                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0 mt-1" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Không có thông báo nào
            </h3>
            <p className="text-sm text-gray-500">
              Hiện tại chưa có thông báo nào từ nhà trường
            </p>
          </div>
        )}
      </div>

      {/* Announcement Detail Dialog */}
      <Dialog
        open={!!selectedAnnouncement}
        onOpenChange={() => setSelectedAnnouncement(null)}
      >
        <DialogContent className="max-w-md rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-left">
              <span className="text-lg font-bold">Chi tiết thông báo</span>
            </DialogTitle>
          </DialogHeader>

          {selectedAnnouncement && (
            <div className="space-y-5 py-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-gray-500">
                  {format(new Date(selectedAnnouncement.date), "dd/MM/yyyy", {
                    locale: vi,
                  })}{" "}
                  • {formatTime(selectedAnnouncement.time)}
                </span>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  {selectedAnnouncement.title}
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedAnnouncement.message}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-500 pt-3 border-t border-gray-100">
                <User className="h-4 w-4 flex-shrink-0" />
                <span>Nhà trường</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BottomNavBar />
    </div>
  );
};

export default StudentAnnouncements;
