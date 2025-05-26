export interface Announcement {
  id: number;
  title: string;
  message: string;
  category: string; // e.g., "Reminder", "Update", "Transaction"
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  recipients: string[]; // Thêm trường này vào model
}

export const initialAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Reminder!",
    message: "Don't forget to submit your assignments.",
    category: "Reminder",
    date: "2025-05-21",
    time: "10:00",
    recipients: ["Students"],
  },
  {
    id: 2,
    title: "New Update",
    message: "The school will be closed on May 25th for maintenance.",
    category: "Update",
    date: "2025-05-20",
    time: "15:30",
    recipients: ["Parents", "Teachers"],
  },
  {
    id: 3,
    title: "Transaction Alert",
    message: "Your payment of $100.00 has been received.",
    category: "Transaction",
    date: "2025-05-19",
    time: "09:00",
    recipients: ["Admins"],
  },
];
