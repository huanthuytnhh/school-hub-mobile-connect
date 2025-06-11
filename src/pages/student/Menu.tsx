import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getMenus } from "@/api/menuApi";
import { Menu } from "@/models/menu";
import BottomNavBar from "@/components/BottomNavBar";
import { getWeekDates, getDayName } from "@/utils/dateUtils";

const StudentMenu = () => {
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date().toISOString().split("T")[0];
    const initialWeek = getWeekDates();
    return initialWeek.includes(today) ? today : initialWeek[0];
  });
  const [weekDates, setWeekDates] = useState<string[]>(getWeekDates());
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const data = await getMenus();
      setMenus(data);
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải thực đơn",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Tìm thực đơn cho ngày được chọn
  const currentMenu = menus.find((menu) => menu.date === selectedDate) || {
    id: 0,
    date: selectedDate,
    imageUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    items: [],
  };

  // Lấy tháng và năm cho header
  const getMonthYear = (): string => {
    const date = new Date(selectedDate);
    return date.toLocaleDateString("vi-VN", { month: "long", year: "numeric" });
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-school-primary text-white p-5 shadow-md">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Thực đơn</h1>
          <div className="text-sm font-medium">{getMonthYear()}</div>
        </div>
      </div>

      {/* Date Selector */}
      <div className="px-4 py-3 bg-white shadow-sm">
        <div className="flex overflow-x-auto hide-scrollbar space-x-3 py-1">
          {weekDates.map((date) => (
            <button
              key={date}
              onClick={() => setSelectedDate(date)}
              className={`flex flex-col items-center justify-center min-w-[50px] h-[60px] rounded-full px-3 py-2 transition-colors duration-200 ease-in-out transform active:scale-95
                ${
                  selectedDate === date
                    ? "bg-school-primary text-white font-bold shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              <span className="text-xs">{getDayName(date)}</span>
              <span className="text-lg mt-1">{new Date(date).getDate()}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-5 pt-4 pb-16">
        {/* Menu Title */}
        <div className="mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            Thực đơn | {format(new Date(selectedDate), "dd/MM/yyyy")} |{" "}
            {getDayName(selectedDate)}
          </h2>
        </div>

        {/* Menu Image */}
        <div className="relative mb-6">
          <img
            src={currentMenu.imageUrl}
            alt="Menu"
            className="w-full h-48 object-cover rounded-xl shadow-md"
          />
        </div>

        {/* Menu Items */}
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="flex justify-between font-bold border-b pb-2 mb-2 text-gray-700">
            <span>Món ăn</span>
            <span>Số lượng</span>
          </div>

          {currentMenu.items.length > 0 ? (
            currentMenu.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between py-2 border-b border-gray-100 last:border-b-0 text-gray-800"
              >
                <span>{item.name}</span>
                <span className="text-gray-600">{item.amount}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 text-base">
              Không có món ăn cho ngày này
            </div>
          )}
        </div>
      </div>

      <BottomNavBar />
    </div>
  );
};

export default StudentMenu;
