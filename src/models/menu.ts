export interface MenuItem {
  id: number;
  name: string;
  amount: string;
}

export interface Menu {
  id: number;
  date: string; // ISO format: YYYY-MM-DD
  imageUrl: string;
  items: MenuItem[];
}

// Sample data for the food menu
export const initialMenus: Menu[] = [
  {
    id: 1,
    date: "2025-05-19", // Monday
    imageUrl:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    items: [
      { id: 1, name: "Cơm Trắng", amount: "200g" },
      { id: 2, name: "Bò Xào Hành Tây", amount: "1 Ser" },
      { id: 3, name: "Mướp Xào", amount: "1 Ser" },
      { id: 4, name: "Bánh Bông Lan", amount: "1" },
    ],
  },
  {
    id: 2,
    date: "2025-05-20", // Tuesday
    imageUrl:
      "https://images.unsplash.com/photo-1547592180-85f173990554?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    items: [
      { id: 1, name: "Mì Xào Hải Sản", amount: "250g" },
      { id: 2, name: "Cá Kho Tộ", amount: "1 Ser" },
      { id: 3, name: "Canh Rau Ngót", amount: "1 Ser" },
      { id: 4, name: "Trái Cây Theo Mùa", amount: "100g" },
    ],
  },
  {
    id: 3,
    date: "2025-05-21", // Wednesday (Today)
    imageUrl:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    items: [
      { id: 1, name: "Bún Riêu", amount: "300g" },
      { id: 2, name: "Chả Giò", amount: "2" },
      { id: 3, name: "Rau Sống", amount: "1 Phần" },
      { id: 4, name: "Chè Đậu Xanh", amount: "1 Chén" },
    ],
  },
  {
    id: 4,
    date: "2025-05-22", // Thursday
    imageUrl:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    items: [
      { id: 1, name: "Phở Bò", amount: "350g" },
      { id: 2, name: "Giá Đỗ", amount: "50g" },
      { id: 3, name: "Quẩy", amount: "2" },
      { id: 4, name: "Bánh Flan", amount: "1" },
    ],
  },
  {
    id: 5,
    date: "2025-05-23", // Friday
    imageUrl:
      "https://images.unsplash.com/photo-1493770348161-369560ae357d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    items: [
      { id: 1, name: "Bánh Mì", amount: "1" },
      { id: 2, name: "Xúc Xích", amount: "1" },
      { id: 3, name: "Trứng Ốp La", amount: "1" },
      { id: 4, name: "Sữa Tươi", amount: "200ml" },
    ],
  },
  {
    id: 6,
    date: "2025-05-24", // Saturday
    imageUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    items: [
      { id: 1, name: "Cơm Gà", amount: "250g" },
      { id: 2, name: "Dưa Góp", amount: "50g" },
      { id: 3, name: "Canh Chua", amount: "1 Bát" },
      { id: 4, name: "Xoài", amount: "1" },
    ],
  },
  {
    id: 7,
    date: "2025-05-25", // Sunday
    imageUrl:
      "https://images.unsplash.com/photo-1606787366850-de6330128bfc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    items: [
      { id: 1, name: "Hủ Tiếu Nam Vang", amount: "300g" },
      { id: 2, name: "Nem Nướng", amount: "2" },
      { id: 3, name: "Rau Muống Xào Tỏi", amount: "1 Phần" },
      { id: 4, name: "Chè Thái", amount: "1 Ly" },
    ],
  },
];

// Helper functions
export const getDayName = (dateString: string): string => {
  const date = new Date(dateString);
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  return days[date.getDay()];
};

export const getShortDayName = (dateString: string): string => {
  const date = new Date(dateString);
  const days = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
  return days[date.getDay()];
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date
    .toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-");
};

// Get a week of dates starting from a specific date
export const getWeekDates = (startDate: Date = new Date()): string[] => {
  const dates: string[] = [];
  const currentDay = startDate.getDay();
  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay; // If Sunday, go back 6 days, otherwise go to Monday

  const monday = new Date(startDate);
  monday.setDate(startDate.getDate() + mondayOffset);

  for (let i = 0; i < 7; i++) {
    const day = new Date(monday);
    day.setDate(monday.getDate() + i);
    dates.push(day.toISOString().split("T")[0]);
  }

  return dates;
};
