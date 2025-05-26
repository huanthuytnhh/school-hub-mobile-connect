import React, { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Edit, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { Menu, MenuItem } from "@/models/menu"; // Chỉ import interfaces
import {
  getDayName,
  getShortDayName,
  formatDate,
  getWeekDates,
} from "@/utils/dateUtils"; // Import từ utils
import BottomNavBar from "@/components/BottomNavBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
// Import API functions for Menu
import { getMenus, createMenu, updateMenu, deleteMenu } from "@/api/menuApi";

const FoodPage: React.FC = () => {
  // States
  const [menus, setMenus] = useState<Menu[]>([]); // Khởi tạo rỗng, sẽ load từ API
  const [isLoading, setIsLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState<string | null>(null); // Trạng thái lỗi
  const [weekDates, setWeekDates] = useState<string[]>(getWeekDates());
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date().toISOString().split("T")[0];
    const initialWeek = getWeekDates(); // Tính weekDates một lần để kiểm tra
    return initialWeek.includes(today) ? today : initialWeek[0];
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemAmount, setNewItemAmount] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  // Function to fetch menus from API
  const fetchMenus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getMenus();
      setMenus(data);
      // Cập nhật weekDates nếu cần (ví dụ: muốn hiển thị tuần của menu mới nhất)
      // Hiện tại, getWeekDates() sẽ luôn bắt đầu từ thứ 2 của tuần hiện tại
      // setWeekDates(getWeekDates(new Date(data[0]?.date || new Date())));
    } catch (err) {
      console.error("Failed to fetch menus:", err);
      if (err instanceof Error) {
        setError(err.message || "An unknown error occurred.");
      } else {
        setError("An unknown error occurred while fetching menus.");
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch menus on component mount
  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  // Find the current menu for the selected date
  const currentMenu = menus.find((menu) => menu.date === selectedDate) || {
    id: 0, // ID 0 là tạm thời, sẽ được backend cấp khi tạo mới
    date: selectedDate,
    imageUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80", // Ảnh mặc định
    items: [],
  };

  // Effect to set up editing menu when entering edit mode
  useEffect(() => {
    if (isEditing) {
      setEditingMenu({ ...currentMenu });
    } else {
      setEditingMenu(null);
      setNewItemName("");
      setNewItemAmount("");
    }
  }, [isEditing, currentMenu]);

  // Get month and year for the header
  const getMonthYear = (): string => {
    const date = new Date(selectedDate);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  // Handler for date selection
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setIsEditing(false); // Thoát chế độ chỉnh sửa khi đổi ngày
  };

  // Handler for entering edit mode
  const handleEdit = () => {
    setIsEditing(true);
  };

  // Handler for changing menu image
  const handleChangeImage = () => {
    const imageUrls = [
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
    ];

    if (editingMenu) {
      const randomIndex = Math.floor(Math.random() * imageUrls.length);
      setEditingMenu({
        ...editingMenu,
        imageUrl: imageUrls[randomIndex],
      });
    }
  };

  // Handler for adding a new menu item (local state update)
  const handleAddItem = () => {
    if (!editingMenu || !newItemName.trim() || !newItemAmount.trim()) return;

    const newId =
      editingMenu.items.length > 0
        ? Math.max(...editingMenu.items.map((item) => item.id)) + 1
        : 1; // ID tạm thời cho local state

    const newItem: MenuItem = {
      id: newId,
      name: newItemName.trim(),
      amount: newItemAmount.trim(),
    };

    setEditingMenu({
      ...editingMenu,
      items: [...editingMenu.items, newItem],
    });

    setNewItemName("");
    setNewItemAmount("");
  };

  // Handler for removing a menu item (local state update)
  const handleRemoveItem = (itemId: number) => {
    if (!editingMenu) return;

    setEditingMenu({
      ...editingMenu,
      items: editingMenu.items.filter((item) => item.id !== itemId),
    });
  };

  // Handler for saving the edited menu to API
  const handleSave = async () => {
    if (!editingMenu) return;

    try {
      if (editingMenu.id === 0) {
        // New menu (ID is 0)
        await createMenu(editingMenu);
        alert("Menu created successfully!");
      } else {
        // Existing menu
        await updateMenu(editingMenu.id, editingMenu);
        alert("Menu updated successfully!");
      }
      setIsEditing(false);
      fetchMenus(); // Re-fetch all menus to ensure data consistency
    } catch (err) {
      console.error("Failed to save menu:", err);
      alert("Failed to save menu. Please try again.");
    }
  };

  // Handler for opening delete confirmation dialog
  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  // Handler for confirming menu deletion from API
  const confirmDelete = async () => {
    if (!editingMenu || editingMenu.id === 0) {
      // Can't delete a menu that doesn't exist on backend
      alert("Cannot delete a non-existent menu.");
      setIsDeleteDialogOpen(false);
      return;
    }
    try {
      await deleteMenu(editingMenu.id);
      alert("Menu deleted successfully!");
      setIsEditing(false);
      setIsDeleteDialogOpen(false);
      fetchMenus(); // Re-fetch menus to remove the deleted one
      // If the selected date was deleted, automatically select a new date (e.g., first day of the week)
      setSelectedDate(getWeekDates()[0]);
    } catch (err) {
      console.error("Failed to delete menu:", err);
      alert("Failed to delete menu. Please try again.");
    }
  };

  // Hiển thị trạng thái loading và error
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-700 text-lg">
        <svg
          className="animate-spin h-8 w-8 mr-3 text-school-primary"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        Loading menu...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-red-600 text-lg p-4 text-center">
        <svg
          className="h-10 w-10 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <p>Error: {error}</p>
        <p className="text-gray-500 text-sm mt-2">
          Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="mr-4 transition-transform active:scale-95">
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <h1 className="text-xl font-bold">Menu Information</h1>
          </div>
          <div className="text-sm font-medium">{getMonthYear()}</div>
        </div>
      </div>

      {/* Date Selector */}
      <div className="px-4 py-3 bg-white shadow-sm">
        <div className="flex overflow-x-auto hide-scrollbar space-x-3 py-1">
          {weekDates.map((date) => (
            <button
              key={date}
              onClick={() => handleDateSelect(date)}
              className={`flex flex-col items-center justify-center min-w-[50px] h-[60px] rounded-full px-3 py-2 transition-colors duration-200 ease-in-out transform active:scale-95
                ${
                  selectedDate === date
                    ? "bg-school-primary text-white font-bold shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <span className="text-xs">{getShortDayName(date)}</span>
              <span className="text-lg mt-1">{new Date(date).getDate()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-4 pb-16">
        {/* Menu Title with Edit Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Menu | {formatDate(selectedDate)} | {getDayName(selectedDate)}
          </h2>
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
              className="text-school-primary border-school-primary shadow-sm hover:bg-school-primary hover:text-white transition-colors active:scale-95"
            >
              <Edit className="h-4 w-4 mr-1" /> Edit
            </Button>
          )}
        </div>

        {/* Menu Image */}
        <div className="relative mb-6">
          <img
            src={isEditing ? editingMenu?.imageUrl : currentMenu.imageUrl}
            alt="Menu"
            className="w-full h-48 object-cover rounded-xl shadow-md" // Bo góc và shadow đẹp hơn
          />
          {isEditing && (
            <button
              onClick={handleChangeImage}
              className="absolute bottom-2 right-2 bg-white text-school-primary rounded-full p-2 shadow-lg transition-colors hover:bg-gray-100 active:scale-90" // Bo góc, shadow, hover, click
            >
              <Camera className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl shadow-md p-4">
          {" "}
          {/* Bo góc và shadow đẹp hơn */}
          {/* Read Mode */}
          {!isEditing ? (
            <>
              <div className="flex justify-between font-bold border-b pb-2 mb-2 text-gray-700">
                <span>Menu Item</span>
                <span>Amount</span>
              </div>

              {currentMenu.items.length > 0 ? (
                currentMenu.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 border-b border-gray-100 last:border-b-0 text-gray-800" // Không border-b ở item cuối
                  >
                    <span>{item.name}</span>
                    <span className="text-gray-600">{item.amount}</span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-base">
                  No menu items for this day.
                </div>
              )}
            </>
          ) : (
            /* Edit Mode */
            <>
              <h3 className="font-bold mb-3 text-gray-700">Menu Items</h3>

              {/* Existing Items */}
              {editingMenu && editingMenu.items.length > 0 ? (
                <div className="space-y-2 mb-4">
                  {editingMenu.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between bg-gray-50 p-3 rounded-md border border-gray-200" // Bo góc, border
                    >
                      <div className="flex-1 text-gray-800">
                        <span className="font-medium">{item.name}</span>
                        <span className="mx-2 text-gray-400">|</span>
                        <span className="text-gray-600">{item.amount}</span>
                      </div>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="text-red-500 p-1 rounded-full hover:bg-red-100 transition-colors active:scale-90" // Button tròn, hover, click
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 mb-4 text-gray-500 bg-gray-50 rounded-md border border-gray-200">
                  No items yet. Add some below!
                </div>
              )}

              {/* Add New Item */}
              <div className="space-y-3 mt-4 border-t pt-4 border-gray-100">
                <h3 className="font-bold text-gray-700">Add New Item</h3>
                <div className="flex space-x-2">
                  <Input
                    placeholder="Item name"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="flex-1 rounded-lg shadow-sm focus:ring-2 focus:ring-school-secondary"
                  />
                  <Input
                    placeholder="Amount (100g / 1 Ser)"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(e.target.value)}
                    className="w-1/3 rounded-lg shadow-sm focus:ring-2 focus:ring-school-secondary"
                  />
                  <Button
                    onClick={handleAddItem}
                    className="bg-school-primary text-white hover:bg-school-primary/80 rounded-lg shadow-sm active:scale-95" // Đảm bảo button cũng bo góc
                  >
                    +
                  </Button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleSave}
                  className="flex-1 bg-green-600 hover:bg-green-700 rounded-lg shadow-md active:scale-95 transition-all" // Bo góc, shadow
                >
                  Save
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="destructive"
                  className="flex-1 rounded-lg shadow-md active:scale-95 transition-all" // Bo góc, shadow
                >
                  Delete
                </Button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent className="rounded-xl shadow-lg">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-800">
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              This will permanently delete the menu for{" "}
              <span className="font-bold text-school-primary">
                {formatDate(selectedDate)} ({getDayName(selectedDate)})
              </span>{" "}
              from the system. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
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

export default FoodPage;
