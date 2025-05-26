import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Bell,
  MessageCircle,
  DollarSign,
  Megaphone,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Announcement } from "@/models/announcement";
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
import {
  getAnnouncements,
  deleteAnnouncement,
  createAnnouncement,
} from "@/api/announcementApi";
import { toast } from "@/components/ui/use-toast"; // 👈 toast custom của bạn

const AnnouncementsPage: React.FC = () => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [announcementToDelete, setAnnouncementToDelete] =
    useState<Announcement | null>(null);
  const [isAddingDummy, setIsAddingDummy] = useState(false);

  const navigate = useNavigate();

  const fetchAnnouncements = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getAnnouncements();
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setError("Failed to load announcements. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleAddDummyAnnouncement = async () => {
    setIsAddingDummy(true);
    setError(null);

    try {
      const categories = ["Reminder", "Update", "Transaction"];
      const recipientGroups = [
        ["Students"],
        ["Teachers"],
        ["Parents"],
        ["All"],
      ];
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
        .getMinutes()
        .toString()
        .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}`;

      const newAnnouncementData = {
        title: `Auto-Generated Announcement ${Math.floor(
          Math.random() * 1000
        )}`,
        message:
          "This is a dummy announcement created and saved to the backend via API.",
        category: categories[Math.floor(Math.random() * categories.length)],
        date: now.toISOString().split("T")[0],
        time: currentTime,
        recipients:
          recipientGroups[Math.floor(Math.random() * recipientGroups.length)],
      };

      const createdAnnouncement = await createAnnouncement(newAnnouncementData);
      setAnnouncements((prev) => [createdAnnouncement, ...prev]);

      toast({
        title: "Announcement Created",
        description: "Dummy announcement saved successfully.",
        variant: "success",
      });
    } catch (err) {
      console.error("Failed to create dummy announcement via API:", err);
      setError(
        "Failed to create dummy announcement. Please check backend or network."
      );
      toast({
        title: "Creation Failed",
        description: "Could not create dummy announcement.",
        variant: "destructive",
      });
    } finally {
      setIsAddingDummy(false);
    }
  };

  const handleDeleteClick = (announcement: Announcement) => {
    setAnnouncementToDelete(announcement);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (announcementToDelete) {
      try {
        await deleteAnnouncement(announcementToDelete.id);
        setAnnouncements((prev) =>
          prev.filter((a) => a.id !== announcementToDelete.id)
        );
        toast({
          title: "Deleted",
          description: "Announcement was successfully deleted.",
        });
      } catch (err) {
        console.error("Error deleting announcement:", err);
        toast({
          title: "Delete Failed",
          description: "Could not delete the announcement.",
          variant: "destructive",
        });
      } finally {
        setIsDeleteDialogOpen(false);
        setAnnouncementToDelete(null);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-4 flex justify-between items-center sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className="mr-2 p-1 rounded-full hover:bg-white/10 transition"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">
            Announcements
          </h1>
        </div>
        <button
          onClick={handleAddDummyAnnouncement}
          className="flex items-center gap-1 px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-school-primary font-semibold rounded-full shadow hover:bg-gray-100 active:scale-95 transition disabled:opacity-60"
          disabled={isAddingDummy}
          title="Add Dummy Announcement via API"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden sm:inline">
            {isAddingDummy ? "Adding..." : "Add"}
          </span>
          <span className="sm:hidden">
            {isAddingDummy ? <span className="animate-pulse">...</span> : null}
          </span>
        </button>
      </div>

      {/* List */}
      <div className="px-2 sm:px-5 mt-4 space-y-4 sm:space-y-6">
        {isLoading ? (
          <p className="text-center text-gray-600 mt-8">
            Loading announcements...
          </p>
        ) : error ? (
          <p className="text-center text-red-500 mt-8">{error}</p>
        ) : announcements.length === 0 ? (
          <p className="text-center text-gray-600 mt-8">
            No announcements found. Click "Add" to create one.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="bg-white p-3 sm:p-4 rounded-xl shadow-sm flex items-center justify-between gap-2 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-11 w-11 min-w-[2.75rem] rounded-full flex items-center justify-center bg-gradient-to-br from-school-primary/80 to-blue-400 text-white shadow text-xl">
                    {announcement.category === "Reminder" && (
                      <Bell className="h-6 w-6" />
                    )}
                    {announcement.category === "Update" && (
                      <MessageCircle className="h-6 w-6" />
                    )}
                    {announcement.category === "Transaction" && (
                      <DollarSign className="h-6 w-6" />
                    )}
                    {!["Reminder", "Update", "Transaction"].includes(
                      announcement.category
                    ) && <Megaphone className="h-6 w-6" />}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-800 truncate max-w-[12rem] sm:max-w-xs">
                      {announcement.title}
                    </h3>
                    <p className="text-sm text-gray-600 truncate max-w-[14rem] sm:max-w-sm">
                      {announcement.message}
                    </p>
                    <span className="text-xs text-gray-400">
                      <span className="inline-block align-middle mr-1">
                        {announcement.time}
                      </span>
                      <span className="inline-block align-middle">
                        {announcement.date}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 items-end ml-2">
                  <button
                    onClick={() =>
                      navigate(`/announcements/${announcement.id}/edit`)
                    }
                    className="p-2 rounded-full text-blue-500 hover:bg-blue-50 hover:text-blue-700 transition"
                    title="Edit"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(announcement)}
                    className="p-2 rounded-full text-red-500 hover:bg-red-50 hover:text-red-700 transition"
                    title="Delete"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Dialog */}
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
