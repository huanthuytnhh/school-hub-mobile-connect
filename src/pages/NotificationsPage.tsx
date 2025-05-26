import React, { useState } from "react";
import { ArrowLeft, Plus, Edit, Trash2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { initialAnnouncements, Announcement } from "@/models/announcement";
import BottomNavBar from "@/components/BottomNavBar";
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

const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] =
    useState<Announcement[]>(initialAnnouncements);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<Announcement | null>(null);
  const navigate = useNavigate();

  // Group announcements by date
  const groupByDate = (announcements: Announcement[]) => {
    const grouped: { [key: string]: Announcement[] } = {};
    announcements.forEach((announcement) => {
      if (!grouped[announcement.date]) {
        grouped[announcement.date] = [];
      }
      grouped[announcement.date].push(announcement);
    });
    return grouped;
  };

  const groupedAnnouncements = groupByDate(announcements);

  const handleDelete = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (announcementToDelete) {
      setAnnouncements(
        announcements.filter((a) => a.id !== announcementToDelete.id)
      );
      setIsDeleteDialogOpen(false);
      setAnnouncementToDelete(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Notifications</h1>
        </div>
        <button
          onClick={() => navigate("/notifications/new")}
          className="flex items-center gap-2 px-4 py-2 bg-school-primary text-white rounded-full shadow-md hover:bg-school-primary/90"
        >
          <Plus className="h-5 w-5" /> Add Announcement
        </button>
      </div>

      {/* Announcements List */}
      <div className="px-5 mt-4 space-y-6">
        {Object.keys(groupedAnnouncements).map((date) => (
          <div key={date}>
            <h2 className="text-lg font-bold text-gray-700 mb-3">{date}</h2>
            <div className="space-y-3">
              {groupedAnnouncements[date].map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 mr-4">
                      {announcement.category === "Reminder" && "🔔"}
                      {announcement.category === "Update" && "💬"}
                      {announcement.category === "Transaction" && "💰"}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800">
                        {announcement.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {announcement.message}
                      </p>
                      <span className="text-xs text-gray-500">
                        {announcement.time} - {announcement.date}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        navigate(`/notifications/${announcement.id}/edit`)
                      }
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
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
              {announcementToDelete?.title}".
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

      <BottomNavBar />
    </div>
  );
};

export default AnnouncementsPage;
