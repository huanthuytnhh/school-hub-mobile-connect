// src/utils/dateUtils.ts

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
