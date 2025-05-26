import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const AddAnnouncementPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    message: "",
    category: "Reminder",
    date: new Date().toISOString().split("T")[0],
    time: "12:00",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // Logic to save the announcement
    console.log("Announcement saved:", formData);
    navigate("/announcements");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 flex items-center">
        <Link to="/announcements" className="mr-4">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-xl font-bold">Add Announcement</h1>
      </div>

      {/* Form */}
      <div className="p-5 space-y-4">
        <Input
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Title"
          className="w-full"
        />
        <textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          placeholder="Message"
          className="w-full p-2 border rounded-md"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleInputChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="Reminder">Reminder</option>
          <option value="Update">Update</option>
          <option value="Transaction">Transaction</option>
        </select>
        <Input
          name="date"
          type="date"
          value={formData.date}
          onChange={handleInputChange}
          className="w-full"
        />
        <Input
          name="time"
          type="time"
          value={formData.time}
          onChange={handleInputChange}
          className="w-full"
        />
        <Button
          onClick={handleSave}
          className="w-full bg-school-primary text-white"
        >
          <Save className="h-5 w-5 mr-2" /> Save
        </Button>
      </div>
    </div>
  );
};

export default AddAnnouncementPage;
