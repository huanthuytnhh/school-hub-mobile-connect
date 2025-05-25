import React, { useState, useEffect } from "react";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { initialAnnouncements, Announcement } from "@/models/announcement";
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

const AnnouncementsDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Announcement | null>(null);

  useEffect(() => {
    if (id === "new") {
      setFormData({
        id: Date.now(),
        title: "",
        message: "",
        category: "Reminder",
        date: new Date().toISOString().split("T")[0],
        time: "12:00",
        recipients: [],
      });
    } else {
      const announcement = initialAnnouncements.find(
        (a) => a.id === parseInt(id || "", 10)
      );
      if (announcement) {
        setFormData(announcement);
      }
    }
  }, [id]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  const handleSave = () => {
    if (!formData) return;

    // In a real app, save to backend here
    alert("Announcement saved successfully");
    navigate("/announcements");
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, delete from backend here
    alert("Announcement deleted successfully");
    navigate("/announcements");
  };

  if (!formData) {
    return <div className="p-5">Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 flex justify-between items-center">
        <div className="flex items-center">
          <Link to="/announcements" className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-bold">Notification</h1>
        </div>
      </div>

      {/* Form */}
      <div className="px-5 mt-6 space-y-4">
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
            value={formData.title}
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
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Enter message..."
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-school-primary focus:border-school-primary"
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
            value={formData.category}
            onChange={handleInputChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring focus:ring-school-primary focus:border-school-primary"
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
            value={formData.date}
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
            value={formData.time}
            onChange={handleInputChange}
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="recipients"
            className="block text-sm font-medium text-gray-700"
          >
            Recipients
          </label>
          <Input
            id="recipients"
            name="recipients"
            value={formData.recipients.join(", ")}
            onChange={(e) =>
              setFormData((prev) =>
                prev
                  ? { ...prev, recipients: e.target.value.split(", ") }
                  : null
              )
            }
            placeholder="Enter recipients (comma-separated)"
          />
        </div>

        <div className="flex gap-3 mt-6">
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={handleSave}
          >
            <Save className="mr-2 h-4 w-4" /> Save
          </Button>
          {id !== "new" && (
            <Button
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
              onClick={handleDelete}
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
              {formData?.title}".
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
